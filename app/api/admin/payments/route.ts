export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: any = {}
 
    if (status) where.status = status
    if (search) {
      where.invoice = {
        ...where.invoice,
          student: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          },
      }
    }

    const payments = await prisma.payment.findMany({
      where:{
          AND:[
            {...where},
            {invoice:{
              student:{ hostelId: session.hostelId }
            }}
        ]
      },
      include: {
        invoice: {
          include: {
                student: true,
              },
        },
      },
    })
    console.log(payments);
    

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[v0] Get payments error:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payment = await prisma.payment.create({
      data: {
        ...body,
        invoiceId: Number.parseInt(body.invoiceId),
      },
      include: {
        invoice: {
          include: {
                student: true,
            },
        },
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error("[v0] Create payment error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {

     const session = await getSession()
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    const body = await request.json()
    const { id, ...updateData } = body

    const payment = await prisma.payment.update({
      where: { id: id },
      data: updateData,
      include: {
        invoice: {
          include: {
                student: true,
          },
        },
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error("[v0] Update payment error:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}
