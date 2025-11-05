export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const session = await getSession()
              
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        } 
    
    const {id} = await params
    const booking = await prisma.booking.findFirst({
      where: {
        AND:[
          { id: id},
          {hostelId:session.hostelId!}
        ]
      },
      include: {
        room: {
          include: { hostel: true },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }:any) {
  try {
    const session = await getSession()
    const {id} = await params
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    if (!id) {
      return NextResponse.json({ error: "No booking id were provided!" }, { status: 400 })
    } 


    const data = await request.json();
    
    
    
    await prisma.booking.updateMany({
      where:{
        AND:[
          {id:id},
          {hostelId:session.hostelId!}
        ]
      },
      data
    })

    return NextResponse.json({message:"Booking updated"},{status:201})

  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const session = await getSession()
    const {id} = await params
          
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    await prisma.booking.deleteMany({
      where: { 
        AND:[
          {id: id },
          {hostelId:session.hostelId!}
        ]
      },
    })

    return NextResponse.json({ messag: "Booking deleted" },{status:201})
  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
