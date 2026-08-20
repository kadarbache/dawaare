"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomBytes } from "crypto";
import { requireAdmin, AuthError } from "@/lib/auth-guard";

type ActionState = {
  error?: string | null;
  success?: boolean;
  temporaryPassword?: string;
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
  // Random per-account temporary password, shown once to the admin so it can be shared with the new staff member.
  const password = randomBytes(9).toString("base64url");

  try {
    await requireAdmin();

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
    return { success: true, temporaryPassword: password };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    if (error instanceof APIError) {
      return { error: error.message };
    }
    console.error(error);
    return { error: "An unexpected error occurred while adding the seller" };
  }
}
