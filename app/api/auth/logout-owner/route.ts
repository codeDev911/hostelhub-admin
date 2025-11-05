export const runtime = "nodejs";
import { destroySession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await destroySession()
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
