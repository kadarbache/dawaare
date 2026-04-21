"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type ActionState = {
  error?: string | null;
  success?: boolean;
};

export async function addSellerAction(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  let firstName = formData.get("firstName") as string;
  let lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!email || !firstName || !lastName || !phone) {
    return { error: "All fields are required" };
  }

  firstName = firstName.trim().toLocaleLowerCase();
  lastName = lastName.trim().toLocaleLowerCase();
  const name = `${firstName} ${lastName}`;
  // Using a default password for staff accounts. They can change it later.
  const password = "dawaarepassword123";

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        image: "",
        role: "SELLER",
        number: phone,
        image_id: "",
      },
      headers: await headers(),
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    console.error(error);
    return { error: "An unexpected error occurred while adding the seller" };
  }
}
