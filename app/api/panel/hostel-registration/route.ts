export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status")
    const skip = Number.parseInt(req.nextUrl.searchParams.get("skip") || "0")
    const take = Number.parseInt(req.nextUrl.searchParams.get("take") || "10")

    let where : any
    if(status) where.status = status
    const registrations = await prisma.hostelRegistration.findMany({
      where,
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

  

    return NextResponse.json({
      registrations,
      total:registrations.length, 
    })
  } catch (error) {
    console.error(" Get registrations error:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
