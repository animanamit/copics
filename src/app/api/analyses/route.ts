import { NextRequest, NextResponse } from "next/server";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user from Convex
    const user = await fetchAuthQuery(api.auth.getCurrentUser);

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const analyses = await fetchAuthQuery(api.analyses.listForUser, {
      userId: user._id,
      limit,
    });

    return NextResponse.json({
      analyses: analyses.map((a) => ({
        analysisId: a._id,
        imageName: a.imageName,
        imageUrl: a.imageUrl,
        status: a.status,
        createdAt: a._creationTime,
        result: a.result,
      })),
    });
  } catch (error) {
    console.error("list analyses error:", error);
    return NextResponse.json(
      { error: "failed to list analyses" },
      { status: 500 }
    );
  }
}
