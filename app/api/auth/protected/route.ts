export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

/**
 * This is an example protected API route.
 * Use this pattern for any admin-only API endpoints.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Your protected logic here
    return NextResponse.json({ message: "Access granted", session })
  } catch (error) {
    console.error("[v0] Protected route error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
