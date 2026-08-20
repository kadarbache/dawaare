import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File is too large (max 5MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dawaare/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: "No public_id provided" },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Image deletion failed:", error);
    return NextResponse.json(
      { error: "Image deletion failed" },
      { status: 500 }
    );
  }
}
