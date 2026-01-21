import { NextRequest, NextResponse } from "next/server";
import { fetchAuthQuery, fetchAuthMutation } from "@/lib/auth-server";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { deleteS3Object, extractS3KeyFromUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { id: analysisId } = await params;

    const analysis = await fetchAuthQuery(api.analyses.getByIdForUser, {
      id: analysisId as Id<"analyses">,
      userId: user._id,
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      analysisId: analysis._id,
      imageName: analysis.imageName,
      name: analysis.name || analysis.imageName,
      imageUrl: analysis.imageUrl,
      status: analysis.status,
      result: analysis.result,
      options: analysis.options,
      createdAt: analysis._creationTime,
    });
  } catch (error) {
    console.error("get analysis error:", error);
    return NextResponse.json(
      { error: "failed to get analysis" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { id: analysisId } = await params;

    // First, fetch the analysis to get the imageUrl
    const analysis = await fetchAuthQuery(api.analyses.getByIdForUser, {
      id: analysisId as Id<"analyses">,
      userId: user._id,
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "analysis not found" },
        { status: 404 }
      );
    }

    // Step 1: Delete the image from S3 first (if it exists)
    if (analysis.imageUrl) {
      const s3Key = extractS3KeyFromUrl(analysis.imageUrl);
      if (s3Key) {
        try {
          await deleteS3Object(s3Key);
        } catch (s3Error) {
          console.error("failed to delete S3 object:", s3Error);
          return NextResponse.json(
            { error: "failed to delete image from storage" },
            { status: 500 }
          );
        }
      }
    }

    // Step 2: Only delete the database record after S3 deletion succeeds
    await fetchAuthMutation(api.analyses.remove, {
      id: analysisId as Id<"analyses">,
      userId: user._id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("delete analysis error:", error);
    return NextResponse.json(
      { error: "failed to delete analysis" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { id: analysisId } = await params;
    const body = await request.json();
    const { name } = body;

    if (name !== undefined) {
      await fetchAuthMutation(api.analyses.updateName, {
        id: analysisId as Id<"analyses">,
        userId: user._id,
        name,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("update analysis error:", error);
    return NextResponse.json(
      { error: "failed to update analysis" },
      { status: 500 }
    );
  }
}
