export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const hostel = await prisma.hostel.findUnique({
      where: { id },
      include: {
        owner: {
          select:{
            businessName:true,
            businessType:true,
            phone:true,
            admin:{
              select:{
                email:true,
              }
            }
          }
        },
        rooms: {
          include:{
            bookings:{
              where:{
                status:"pending"
              },
              select:{
                numberOfSeats:true
              }
            },
            students:{
              select:{
                id:true
              }
            }
          }
        },
        students: true,
      },
    })

    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 })
    }
    const filteredRoomResult = hostel.rooms.filter(room=>{
      return (room.totalSeats - (room.students.length || 0))  > 0
    })
    const {rooms , ...result} = hostel
    
    return NextResponse.json({...result, rooms:filteredRoomResult})
  } catch (error) {
    console.error("[v0] Get hostel error:", error)
    return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const hostel = await prisma.hostel.update({
      where: { id },
      data: body,
      include: {
        owner: true,
        rooms: true,
      },
    })

    return NextResponse.json(hostel)
  } catch (error) {
    console.error("[v0] Update hostel error:", error)
    return NextResponse.json({ error: "Failed to update hostel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.hostel.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete hostel error:", error)
    return NextResponse.json({ error: "Failed to delete hostel" }, { status: 500 })
  }
}
