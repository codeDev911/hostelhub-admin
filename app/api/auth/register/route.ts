export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hostelOwnerId, email, password } = body

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
    }

    // Verify hostel owner exists
    const hostelOwner = await prisma.hostelOwner.findUnique({
      where: { id: hostelOwnerId },
    })

    if (!hostelOwner) {
      return NextResponse.json({ error: "Hostel owner not found" }, { status: 404 })
    }

    const admin = await prisma.admin.create({
      data: {
        hostelOwnerId,
        email,
        password, // In production, hash this!
        role: "admin",
       
      },
      include: {
        hostelOwner: true,
      },
    })

    // Create session
    await createSession({
      adminId: admin.id,
      email: admin.email,
      hostelOwnerId: admin.hostelOwnerId,
      hostelId:admin.hostelOwnerId
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
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
