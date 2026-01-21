import { NextRequest, NextResponse } from "next/server";
import { fetchAuthMutation, fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import { generatePresignedUploadUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No authenticated user found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { filename, contentType, name } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "Missing required field: filename" },
        { status: 400 }
      );
    }

    // Generate presigned URL for S3 upload
    const { uploadUrl, imageUrl } = await generatePresignedUploadUrl(
      user._id,
      filename,
      contentType || "image/jpeg"
    );

    // Create analysis record in Convex with pending status
    const analysisId = await fetchAuthMutation(api.analyses.create, {
      userId: user._id,
      imageName: filename,
      imageUrl,
      name: name || filename.replace(/\.[^/.]+$/, ""),
    });

    return NextResponse.json({
      uploadUrl,
      imageUrl,
      analysisId,
    });
  } catch (error) {
    console.error("upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Failed to generate upload URL",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
