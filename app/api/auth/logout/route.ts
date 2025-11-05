import { type NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
