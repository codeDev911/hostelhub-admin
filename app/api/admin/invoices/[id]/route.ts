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
    const invoice = await prisma.invoice.findFirst({
      where: { AND:[
        {id: id },
        {hostelId:session.hostelId!}
      ]},
      include: {
            student: {
              include:{
                room:{
                  select:{
                    roomNumber:true,
                    roomType:true,
                    pricePerMonth:true,
                    floor:true
                  }
                }
              }
            },
            payments: {
              select:{
                id:true,
                paymentDate:true,
                paymentMethod:true,
                amount:true
              }
            },
            hostel:{
              select:{
                name:true,
                address:true,
                phone:true,
                email:true,
              }
            }
          },
      
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("[v0] Get invoice error:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}
