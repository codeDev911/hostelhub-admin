export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") || "pending"
    const skip = Number.parseInt(req.nextUrl.searchParams.get("skip") || "0")
    const take = Number.parseInt(req.nextUrl.searchParams.get("take") || "10")

    const registrations = await prisma.hostelRegistration.findMany({
      where: status ? { status } : undefined,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        verificationToken: {
          select: {
            token: true,
            expiresAt: true,
            usedAt: true,
          },
        },
      },
    })

    const total = await prisma.hostelRegistration.count({
      where: status ? { status } : undefined,
    })

    return NextResponse.json({
      registrations,
      total,
      page: Math.ceil(skip / take) + 1,
      pages: Math.ceil(total / take),
    })
  } catch (error) {
    console.error("[v0] Get registrations error:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
