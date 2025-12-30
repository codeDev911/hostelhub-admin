export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


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
    

    return NextResponse.json(hostels,{
       headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
    })
  } catch (error) {
    console.error("[v0] Get hostel error:", error)
    return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
  }
}

 
 
