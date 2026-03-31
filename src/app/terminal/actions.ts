"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function submitSale(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const rawCart = formData.get("cart_payload") as string;
    const notes = formData.get("notes") as string;
    const paymentMethod =
      (formData.get("payment_method") as "ZAAD") || "CASH" || "E_DAHAB";
    const customerId = formData.get("customer_id") as string;
    const amountPaidInput = formData.get("amount_paid") as string;

    if (!rawCart) {
      return { error: "Cart is empty." };
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

    const tax = cartTotal * 0.05;
    const grandTotal = cartTotal + tax;

    const parsedAmountPaid = amountPaidInput
      ? parseFloat(amountPaidInput)
      : grandTotal;
    const remaining = grandTotal - parsedAmountPaid;

    // Process all operations in a database transaction
    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          customer_id: customerId && customerId.length > 0 ? customerId : null,
          total_amount: grandTotal,
          amount_paid: parsedAmountPaid,
          remaining: remaining > 0 ? remaining : 0,
          // TODO: add unpaid state
          status: remaining > 0.01 ? "partial" : "paid",
          payment_method: paymentMethod || "ZAAD",
          notes: notes,
        },
      });

      for (const item of cartItems) {
        await tx.saleItem.create({
          data: {
            sale_id: sale.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.price,
            total_price: item.quantity * item.product.price,
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
    console.error("Checkout failed:", error);
    const err = error as Error;
    return {
      error: err?.message || "An error occurred while finishing the sale.",
    };
  }
}
