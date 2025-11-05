import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const admin = await prisma.admin.findUnique({
      where: { email },
      include: {
        hostelOwner: true,
      },
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In production, use bcrypt or similar for password hashing
    if (password !== admin.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession({
      adminId: admin.id,
      email: admin.email,
      hostelOwnerId: admin.hostelOwnerId,
    })

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        hostelOwner: admin.hostelOwner,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
