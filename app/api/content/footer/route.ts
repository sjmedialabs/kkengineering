import { NextResponse } from "next/server"
import { getRepository } from "@/lib/repo"

export async function GET() {
  try {
    const repo = getRepository()
    const content = await repo.getFooterContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Failed to fetch footer content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
