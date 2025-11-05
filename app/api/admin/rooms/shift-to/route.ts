export const runtime = "nodejs";
export const revalidate = 0
export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {

    const url = new URL(request.url);
    const session = await getSession()
    const toRoomId = url.searchParams.get("toRoomId"); 

    if(!toRoomId){
      return NextResponse.json({ error: "toRoomId is required" }, { status: 400 })
    }

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    let isRoomReady = await prisma.room.findFirst({
      where:{
        AND:[
          {id:toRoomId},
        ]
      },
      include:{
        students:{
          select:{
            id:true
          }
        }
      }
    })

    if(isRoomReady&& isRoomReady?.totalSeats - (isRoomReady?.students.length||0) <= 0 ){
      return NextResponse.json({"message":"Room is full"},{status:400})
    }

    const { studentId } = await request.json()
    

  
    
    // Update the student's room assignment
    await prisma.student.updateMany({
      where: { 
        AND:[
          {id: studentId},
          {hostelId:session.hostelId}
        ]
       },
      data: { roomId: toRoomId }
    })
    

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete room error:", error)
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}


