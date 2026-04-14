import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        // IMPORTANT: Use your actual email address so you can receive the verification link!
        // Your auth.ts requires email verification.
        email: "khadarpaashe123@gmail.com",
        password: "paashe6160", // Change this to your password
        name: "kadar bache",
        role: "ADMIN",
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "User created! Check your email to verify it.",
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
