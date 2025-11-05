export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: "cmhgsm7mf0004vle8y3ybny3y" },
      include: {
        invoice: {
          include: {
            student: {
              include:{
                room:true,
              }
            },
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("[v0] Get payment error:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}
