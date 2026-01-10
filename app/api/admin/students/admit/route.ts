export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if( !session.hostelId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()


    

    const student = await prisma.student.upsert({
      where: { phone: body.phone },
      update: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        hostel: {
          connect:{
            id:session.hostelId
          },
        },
        room:{
          connect:{ id: body.roomId }
        },
        checkInDate: new Date(body.checkInDate),
        status: "active",
      },
      create: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        cnnic: body.cnnic,
        dateOfBirth: body.dateOfBirth  ? new Date(body.dateOfBirth ): new Date(),
        gender: body.gender,
        address: body.address,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        fatherName: body.fatherName,
        fatherPhone: body.fatherPhone,
        fatherCnic: body.fatherCnic,
        fatherOccupation: body.fatherOccupation,
    hostel: {
          connect:{
            id:session.hostelId
          },
        },
        room:{
          connect:{ id: body.roomId }
        },
        checkInDate: new Date(body.checkInDate),
        status: "active",
      },
      include: {
        hostel: true,
        room: true,
      },
    })

    if (body.roomId) {
      const room = await prisma.room.findUnique({
        where: { id: body.roomId },
      })

    }

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("[v0] Admit student error:", error)
    return NextResponse.json({ error: "Failed to admit student" }, { status: 500 })
  }
}
