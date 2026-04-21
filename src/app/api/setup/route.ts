import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({
      success: false,
      message: "This API is only available in development mode",
    });
  }

  try {
    await auth.api.signUpEmail({
      body: {
        // IMPORTANT: Use your actual email address so you can receive the verification link!
        // Your auth.ts requires email verification.
        email: "khadary247@gmail.com",
        password: "12345678", // Change this to your password
        name: "kadar bache",
        role: "SELLER",
        number: "0909090909",
        image: "",
        image_id: "",
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "User created! Check your email to verify it.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "An error occurred",
      },
      { status: 400 },
    );
  }
}
