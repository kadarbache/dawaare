"use server";

import { prisma } from "@/lib/db";
import { deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const cost_price = parseFloat(formData.get("cost_price") as string);
  const stock_qty = parseInt(formData.get("stock_qty") as string);
  const image = formData.get("image") as string;
  const public_id = formData.get("public_id") as string;

  if (
    !name ||
    !sku ||
    !category ||
    isNaN(price) ||
    isNaN(cost_price) ||
    isNaN(stock_qty) ||
    !image
  ) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await prisma.product.create({
      data: {
        name,
        sku,
        category,
        price,
        cost_price,
        stock_qty,
        is_low_stock: stock_qty <= 5,
        image,
        public_id,
      },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);

    if (public_id) {
      try {
        await deleteImage(public_id);
      } catch (deleteError) {
        console.error("Failed to delete orphaned image:", deleteError);
      }
    }

    return {
      success: false,
      error: "Failed to save product. Please try again.",
    };
  }
}
