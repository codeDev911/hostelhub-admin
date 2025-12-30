export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";
export const revalidate = 60; // 1 minute

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
          
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 


    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}

    if (status) where.status = status
    if (search) {
      where.student = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }
    }

    const bookings = await prisma.booking.findMany({
      where:{
        ...where,
        hostelId:session.hostelId!
      },
      include: {
        room: {
          include: { hostel: true },
        },
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Get bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {

  try {
    const session = await getSession()
          
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
        
    const body = await request.json()
    const { id, status } = body

    const booking = await prisma.booking.update({
      where: { id: id },
      data: { status },
      include: {
        room: { include: { hostel: true } },
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Update booking error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
