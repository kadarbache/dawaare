"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireSession, AuthError } from "@/lib/auth-guard";

export type ActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function submitSale(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireSession();
    const sellerId = session.user.id;

    const rawCart = formData.get("cart_payload") as string;
    const notes = formData.get("notes") as string;
    const paymentMethod =
      (formData.get("payment_method") as "ZAAD" | "CASH" | "E_DAHAB") ||
      "CASH";
    const customerId = formData.get("customer_id") as string;
    const amountPaidInput = formData.get("amount_paid") as string;
    const repaymentDate = formData.get("repayment_date") as string;

    if (!rawCart) {
      return { error: "Cart is empty." };
    }
    if (customerId && !repaymentDate) {
      return { error: "Repayment date is required." };
    }

    const cartItems = JSON.parse(rawCart);
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { error: "Invalid cart payload." };
    }

    // Recalculate server-side to prevent tampering
    let cartTotal = 0;
    for (const item of cartItems) {
      cartTotal += item.quantity * item.product.price;
    }

    const grandTotal = cartTotal;

    const parsedAmountPaid = amountPaidInput
      ? parseFloat(amountPaidInput)
      : grandTotal;
    const remaining = grandTotal - parsedAmountPaid;
    const status =
      remaining === grandTotal
        ? "unpaid"
        : remaining > 0.01
          ? "partial"
          : "paid";
    // Process all operations in a database transaction
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          seller_id: sellerId,
          customer_id: customerId && customerId.length > 0 ? customerId : null,
          total_amount: grandTotal,
          amount_paid: parsedAmountPaid,
          remaining: remaining > 0 ? remaining : 0,
          status: status,
          payment_method: paymentMethod || "ZAAD",
          notes: notes,
          repayment_date: new Date(repaymentDate),
        },
      });

      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.product.id },
          select: { stock_qty: true, cost_price: true },
        });

        if (!product || product.stock_qty < item.quantity) {
          throw new Error(
            `Not enough stock for "${item.product.name}". Please refresh and try again.`,
          );
        }

        await tx.saleItem.create({
          data: {
            sale_id: sale.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.price,
            total_price: item.quantity * item.product.price,
            cost_price: product.cost_price,
          },
        });

        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock_qty: { decrement: item.quantity },
          },
        });
      }
    });

    // Revalidate paths that show stock and sales
    revalidatePath("/terminal");
    revalidatePath("/inventory");
    revalidatePath("/sales");

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    console.error("Checkout failed:", error);
    const err = error as Error;
    return {
      error: err?.message || "An error occurred while finishing the sale.",
    };
  }
}
