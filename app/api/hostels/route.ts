export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {

    const hostels = await prisma.hostel.findMany({
      include: {
        owner: true,
        rooms: true,
        students: {
            select:{
                id:true,
            }
        },
      },
    })

    if (!hostels) {
      return NextResponse.json({ error: "Hostels not found" }, { status: 404 })
    }
    

    return NextResponse.json(hostels)
  } catch (error) {
    console.error("[v0] Get hostel error:", error)
    return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
  }
}

 
 
