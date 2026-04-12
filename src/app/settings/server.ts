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
