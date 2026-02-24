import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

// ⛔ IMPORTANT: disable Next.js caching for this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const repo = getRepository();
    const content = await repo.getHomePageContent();

    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to fetch home page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const repo = getRepository();

    let updates: any;
    try {
      updates = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // ✅ Normalize updates (CMS-safe)
    const safeUpdates = {
      hero: updates.hero ?? {},
      stats: updates.stats ?? {},
      features: Array.isArray(updates.features) ? updates.features : [],
      process: updates.process ?? {},
      updatedAt: new Date(),
    };

    const updated = await repo.updateHomePageContent(safeUpdates);

    return NextResponse.json(updated, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to update home page content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}
