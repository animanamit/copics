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
    const { files, analysisName } = body as {
      files: Array<{ filename: string; contentType: string }>;
      analysisName: string;
    };

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Create a single analysis record for all images
    const batchId = await fetchAuthMutation(api.analyses.createBatch, {
      userId: user._id,
      name: analysisName,
      fileCount: files.length,
    });

    // Generate presigned URLs for all files
    const uploadInfos = await Promise.all(
      files.map(async (file, idx) => {
        const { uploadUrl, imageUrl } = await generatePresignedUploadUrl(
          user._id,
          file.filename,
          file.contentType || "image/jpeg"
        );

        return {
          index: idx,
          filename: file.filename,
          uploadUrl,
          imageUrl,
        };
      })
    );

    return NextResponse.json({
      batchId,
      uploads: uploadInfos,
    });
  } catch (error) {
    console.error("batch upload error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to initialize batch upload",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
