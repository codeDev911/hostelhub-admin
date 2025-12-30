export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const revalidate = 60; // 1 minute

export async function GET(request: NextRequest, { params }: any) {

  try {
    const { id } = await params
    const url = new URL(request.url);
    const studentId = url.searchParams.get("fetchStudent"); 
    var  student : any

    if(studentId){
      student = await prisma.student.findUnique({
        where:{
          id:studentId
        },
        select:{
          id:true,
          address:true,
          firstName:true,
          lastName:true,
          email:true,
          phone:true,
          cnnic:true
        }
      })
    }
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
        feedback:{
          where:{
            type:"review"
          },
          select:{
            id:true,
            student:{
              select:{
                id:true,
                firstName:true,
                lastName:true,
              }
            },
            text:true,
            priority:true,
            hostelId:true,
            createdAt:true
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
     
    
    return NextResponse.json({...result, rooms:filteredRoomResult,student})
  } catch (error) {
    console.error("[v0] Get hostel error:", error)
    return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log({body});
    
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
