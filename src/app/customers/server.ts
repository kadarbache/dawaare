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
    return { success: false, error: "Please fill in all required fields (Name and Phone)." };
  }

  try {
    // Check if phone already exists since it's unique
    const existing = await prisma.customer.findUnique({
      where: { phone },
    });
    
    if (existing) {
      return { success: false, error: "A customer with this phone number already exists." };
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
