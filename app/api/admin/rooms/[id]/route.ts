export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";
import { redis } from "@/lib/redis";

export async function DELETE(request: NextRequest, { params }: any) {
  try {

    const session = await getSession()
    const {id} = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    
    const room = await prisma.room.findFirst({
      where:{
        AND:[
          {id:id},
          {hostelId:session.hostelId||""}
        ]
      },
      include:{
        students:{
          select:{
            id:true,
          }
        }
      }
    })

    if (!room){
      return NextResponse.json({ error: "No room of the givenid founded" }, { status: 404 })
    }
    
    if(room.students.length >0 ){
      return NextResponse.json({ error: "Unable to delete room, clear the seats firsts" }, { status: 400 })
    }

    await prisma.room.delete({
      where:{id:id},
      include:{
        bookings:true
      }
    })


    // Decrement room usage by 1 in redis
    await redis.hincrby(`usg:${session.hostelId}`,"rm",-1)

    return NextResponse.json({ success: true },{status:201})
  } catch (error) {
    console.error(" Delete room error:", error)
    return NextResponse.json({ error}, { status: 500 })
  }
}


export async function GET(request: NextRequest, { params }:any) {
  
  try {
    const session = await getSession()
    const {id} = await params;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    const room = await prisma.room.findFirst({
      where: { 
        AND:[
          { id },
          {hostelId: session.hostelId!}
      ]},
      include: {
        hostel: true,
        students: {
          include:{
            invoices:true
          }
        },
      },
    })
    
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("[v0] Get room error:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}