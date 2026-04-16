"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

type State = {
  status: "success" | "error";
  message: string;
};

export async function updateProfile(
  prevState: State | null,
  formData: FormData,
): Promise<State> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const number = formData.get("number") as string;
  const image = formData.get("image") as string;

  if (!firstName) {
    return { status: "error", message: "First name is required" };
  }

  // Combine using array methods as requested
  const nameParts = [firstName, lastName].filter(Boolean);
  const fullName = nameParts.join(" ");

  try {
    await auth.api.updateUser({
      body: {
        name: fullName,
        number: number || "",
        image: image || undefined,
      },
      headers: await headers(),
    });
    return { status: "success", message: "Profile updated successfully" };
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message: "An unexpected error occurred while updating the profile.",
    };
  }
}

// update profile picture

export async function updateProfilePicture(
  image: string,
  image_id: string,
): Promise<State> {
  if (!image || !image_id) {
    return { status: "error", message: "Image is required" };
  }

  try {
    await auth.api.updateUser({
      body: {
        image: image,
        image_id: image_id,
      },
      headers: await headers(),
    });
    return {
      status: "success",
      message: "Profile picture updated successfully",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message:
        "An unexpected error occurred while updating the profile picture.",
    };
  }
}

export async function updatePassword(
  prevState: State | null,
  formData: FormData,
): Promise<State> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { status: "error", message: "All password fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { status: "error", message: "New passwords do not match" };
  }

  if (newPassword.length < 8) {
    return {
      status: "error",
      message: "New password must be at least 8 characters",
    };
  }

  try {
    // Better-auth built-in API for changing password
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true, // often good practice
      },
      headers: await headers(),
    });
    return { status: "success", message: "Password changed successfully" };
  } catch (error) {
    if (error instanceof APIError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message: "Failed to change password. Is your current password valid?",
    };
  }
}
