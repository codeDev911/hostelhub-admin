export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: {
        hostelRegistration: true,
      },
    })
    

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    if (verificationToken.usedAt) {
      return NextResponse.json({ error: "Token already used" }, { status: 400 })
    }

    if (new Date() > verificationToken.expiresAt) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      registration: verificationToken.hostelRegistration,
    })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json({ error: "Failed to verify token" }, { status: 500 })
  }
}
