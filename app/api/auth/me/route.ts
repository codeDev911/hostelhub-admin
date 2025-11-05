export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      include: {
        hostelOwner: {
          include: {
            hostel: true,
          },
        },
      },
    })

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        hostelOwnerId: admin.hostelOwnerId,
      },
      hostelOwner: admin.hostelOwner,
    })
  } catch (error) {
    console.error("[v0] Get auth error:", error)
    return NextResponse.json({ error: "Failed to get auth info" }, { status: 500 })
  }
}
