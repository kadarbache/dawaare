import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// One-time local bootstrap route for creating the first admin account.
// Requires SETUP_SECRET to be set locally and passed as ?secret=... — never set
// SETUP_SECRET in a deployed environment.
export async function GET(request: NextRequest) {
  const setupSecret = process.env.SETUP_SECRET;
  const providedSecret = request.nextUrl.searchParams.get("secret");

  if (
    process.env.NODE_ENV !== "development" ||
    !setupSecret ||
    providedSecret !== setupSecret
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "This API is only available in development mode with a valid setup secret",
      },
      { status: 403 },
    );
  }

  const email = request.nextUrl.searchParams.get("email");
  const password = request.nextUrl.searchParams.get("password");
  const name = request.nextUrl.searchParams.get("name");

  if (!email || !password || !name) {
    return NextResponse.json(
      {
        success: false,
        message: "email, password, and name query params are required",
      },
      { status: 400 },
    );
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "ADMIN",
        number: "",
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
