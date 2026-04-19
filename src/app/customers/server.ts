"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createCustomer(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string | null;
  const address = formData.get("address") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!name || !phone) {
    return {
      success: false,
      error: "Please fill in all required fields (Name and Phone).",
    };
  }

  try {
    // Check if phone already exists since it's unique
    const existing = await prisma.customer.findUnique({
      where: { phone },
    });

    if (existing) {
      return {
        success: false,
        error: "A customer with this phone number already exists.",
      };
    }

    await prisma.customer.create({
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        notes: notes || null,
      },
    });

    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to create customer:", error);

    return {
      success: false,
      error: "Failed to save customer. Please try again.",
    };
  }
}

export async function repayDebt(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const saleId = formData.get("saleId") as string;
  const paymentAmountStr = formData.get("paymentAmount") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  if (!saleId || !paymentAmountStr || !paymentMethod) {
    return { success: false, error: "Missing required fields." };
  }

  const paymentAmount = parseFloat(paymentAmountStr);

  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    return { success: false, error: "Invalid payment amount." };
  }

  if (!["ZAAD", "E_DAHAB", "CASH"].includes(paymentMethod)) {
    return { success: false, error: "Invalid payment method." };
  }

  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return { success: false, error: "Sale not found." };
    }

    if (paymentAmount > sale.remaining) {
      return {
        success: false,
        error: "Payment amount exceeds remaining debt.",
      };
    }

    const newRemaining = Math.max(0, sale.remaining - paymentAmount);
    const newAmountPaid = sale.amount_paid + paymentAmount;
    const newStatus =
      newRemaining === sale.total_amount
        ? "unpaid"
        : newRemaining > 0.01
          ? "partial"
          : "paid";

    await prisma.$transaction(async (tx) => {
      await tx.sale.update({
        where: { id: saleId },
        data: {
          amount_paid: newAmountPaid,
          remaining: newRemaining,
          status: newStatus,
        },
      });

      await tx.repayment.create({
        data: {
          sale_id: saleId,
          repaid_amount: paymentAmount,
          payment_method: paymentMethod as "ZAAD" | "E_DAHAB" | "CASH",
        },
      });
    });

    revalidatePath("/customers");

    return { success: true };
  } catch (error) {
    console.error("Failed to process payment:", error);

    return {
      success: false,
      error: "Failed to process payment. Please try again.",
    };
  }
}
