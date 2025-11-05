export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

 

export async function GET(request: NextRequest) {
  try {
   
    
    const rooms = await prisma.room.findMany({
      where: hostelId ? { hostelId } : undefined,
      include: {
        hostel: true,
        students: true,
      },
    })

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("[v0] Get rooms error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
