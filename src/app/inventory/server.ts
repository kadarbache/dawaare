"use server";

import { prisma } from "@/lib/db";
import { deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { requireSession, AuthError } from "@/lib/auth-guard";
import type { Prisma } from "@prisma/client";

interface ActionResult {
  status: string;
  message: string;
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const catId = formData.get("catId") as string;
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
    return { status: "error", message: "Please fill in all required fields." };
  }

  try {
    await requireSession();

    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return {
        status: "error",
        message: "Product with this SKU already exists.",
      };
    }

    await prisma.$transaction([
      prisma.product.create({
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
      }),
      prisma.itemsCategory.update({
        where: {
          id: catId,
        },
        data: {
          count: {
            increment: 1,
          },
        },
      }),
    ]);

    revalidatePath("/inventory");
    return { status: "success", message: "Product created successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: error.message };
    }
    console.error("Failed to create product:", error);

    if (public_id) {
      try {
        await deleteImage(public_id);
      } catch (deleteError) {
        console.error("Failed to delete orphaned image:", deleteError);
      }
    }

    return {
      status: "error",
      message: "Failed to save product. Please try again.",
    };
  }
}

export async function updateProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const newCatId = formData.get("catId") as string;
  const oldCatName = formData.get("oldCat") as string;
  const price = parseFloat(formData.get("price") as string);
  const cost_price = parseFloat(formData.get("cost_price") as string);
  const stock_qty = parseInt(formData.get("stock_qty") as string);
  const image = formData.get("image") as string;
  const public_id = formData.get("public_id") as string;

  const productData = {
    name,
    sku,
    category,
    price,
    cost_price,
    stock_qty,
    is_low_stock: stock_qty <= 5,
    image,
    public_id,
  };

  if (
    !id ||
    !name ||
    !sku ||
    !category ||
    isNaN(price) ||
    isNaN(cost_price) ||
    isNaN(stock_qty) ||
    !image
  ) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  try {
    await requireSession();

    const oldcat = await prisma.itemsCategory.findUnique({
      where: {
        name: oldCatName,
      },
    });
    const oldCatId = oldcat?.id;

    const updates: Prisma.PrismaPromise<unknown>[] = [
      prisma.product.update({ where: { id }, data: productData }),
    ];

    if (newCatId !== "") {
      // update category count
      if (oldcat && newCatId !== oldCatId) {
        updates.push(
          prisma.itemsCategory.update({
            where: {
              id: oldCatId,
            },
            data: {
              count: {
                decrement: 1,
              },
            },
          }),
        );
      }

      updates.push(
        prisma.itemsCategory.update({
          where: {
            id: newCatId,
          },
          data: {
            count: {
              increment: 1,
            },
          },
        }),
      );
    }

    await prisma.$transaction(updates);

    revalidatePath("/inventory");
    return { status: "success", message: "Product updated successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: error.message };
    }
    console.error("Failed to update product:", error);

    if (public_id) {
      try {
        await deleteImage(public_id);
      } catch (deleteError) {
        console.error("Failed to delete orphaned image:", deleteError);
      }
    }

    return {
      status: "error",
      message: "Failed to update product. Please try again.",
    };
  }
}
