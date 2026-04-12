"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function add_category(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let name = formData.get("category_name") as string;

  if (!name || name.trim() === "") {
    return { status: "error", message: "Category name is required" };
  }

  name = name.toLowerCase().trim();

  const existingCategory = await prisma.itemsCategory.findUnique({
    where: { name },
  });

  if (existingCategory) {
    return { status: "error", message: "Category already exists" };
  }

  try {
    await prisma.itemsCategory.create({
      data: {
        name: name,
        count: 0,
      },
    });

    revalidatePath("/settings");
    return { status: "success", message: "Category created successfully!" };
  } catch (error) {
    console.error("Failed to add category:", error);
    return {
      status: "error",
      message: "Failed to create category. Please try again.",
    };
  }
}

export async function edit_category(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let name = formData.get("category_name") as string;
  const id = formData.get("category_id") as string;

  if (!id || !name || name.trim() === "") {
    return { status: "error", message: "Category ID and name are required" };
  }

  const existingCategory = await prisma.itemsCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { status: "error", message: "Category not found" };
  }

  name = name.toLowerCase().trim();

  try {
    await prisma.itemsCategory.update({
      where: { id },
      data: { name },
    });

    revalidatePath("/settings");
    return { status: "success", message: "Category updated successfully!" };
  } catch (error: unknown) {
    console.error("Failed to update category:", error);
    return {
      status: "error",
      message: "Failed to update category. Please try again.",
    };
  }
}

export async function deleteCategory(id: string): Promise<ActionState> {
  if (!id) {
    return { status: "error", message: "Category ID is required" };
  }

  const existingCategory = await prisma.itemsCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { status: "error", message: "Category not found" };
  }

  try {
    await prisma.itemsCategory.delete({
      where: { id },
    });

    revalidatePath("/settings");
    return { status: "success", message: "Category deleted successfully!" };
  } catch (error: unknown) {
    console.error("Failed to delete category:", error);
    return {
      status: "error",
      message: "Failed to delete category. Please try again.",
    };
  }
}
