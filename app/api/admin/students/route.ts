export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    const { searchParams } = new URL(request.url)
    const paymentStatus = searchParams.get("paymentStatus")
    const search = searchParams.get("search")
    const searchForHostel = searchParams.get("searchForHostel")

    const where: any = {}
    
    if (paymentStatus) where.paymentStatus = paymentStatus
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }


    // Search students for hostels-> this search will be for hostel admin only. 
    if(searchForHostel){
      const stds = await prisma.student.findFirst({
        where:{
          AND:[
          { hostelId:null},
          { OR:[
              { id: { equals: searchForHostel, mode: "default" } },
              { email: { equals: searchForHostel, mode: "default" } },
              { phone: { equals: searchForHostel, mode: "default" } },
            ]}
        ]
        },  
      })
      // const {id,hostelId, roomId,checkInDate,...filterStudent} : any= stds ; 
      return NextResponse.json(stds)
    }

    
    const students = await prisma.student.findMany({
      where:{
        hostelId: session.hostelId,
      ...where
      },
      include: {
        hostel: {
          include: { rooms: true },
        },
        room: true,
        invoices: true,
      },
    })
    

    return NextResponse.json(students)
  } catch (error) {
    console.error("[v0] Get students error:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const updatedStudent = await prisma.student.update({
      where: { id: id },
      data: updateData,
      include: {
        hostel: true,
        room: true,
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error("[v0] Update student error:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}
