export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const {id} = await params
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    const student = await prisma.student.findUnique({
      where: { 
        id: id
      },
      include: {
        hostel: {
          include: { rooms: true },
        },
        room: true,
        invoices: {
          include: { payments: true },
        },
        
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student,{status:200})
  } catch (error) {
    console.error("[v0] Get student error:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}


// Revoke student from hostel
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const {id}= await params

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const student = await prisma.student.update({
      where: {
        id,
        hostelId: session.hostelId!
      },
      data: {
        hostelId: null,
        roomId: null,
        status: "inactive"
      }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete student error:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
