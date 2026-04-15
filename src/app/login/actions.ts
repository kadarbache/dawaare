"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

type State = {
  error?: string | null;
  success?: boolean;
};

export async function loginAction(
  prevState: State | null,
  formData: FormData,
): Promise<State> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred" };
  }

  // Redirect on success
  redirect("/dashboard");
}
