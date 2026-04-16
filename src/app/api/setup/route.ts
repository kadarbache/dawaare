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
    // const user = await auth.api.signUpEmail({
    //   body: {
    //     // IMPORTANT: Use your actual email address so you can receive the verification link!
    //     // Your auth.ts requires email verification.
    //     email: "[EMAIL_ADDRESS]",
    //     password: "[PASSWORD]", // Change this to your password
    //     name: "[NAME_OF_ADMIN]",
    //     role: "ADMIN",
    //   },
    //   headers: request.headers,
    // });

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
