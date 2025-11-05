export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")

    const invoices = await prisma.invoice.findMany({
      where: {
        ...(studentId && { studentId }),
        ...(status && { status }),
      },
      include: {
        student: true,
        booking: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("[v0] Get invoices error:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const invoice = await prisma.invoice.update({
      where: { id: body.invoiceId },
      data: {
        status: "paid",
      },
      include: {
        student: true,
        booking: true,
      },
    })

    const payment = await prisma.payment.create({
      data: {
        studentId: body.studentId,
        invoiceId: body.invoiceId,
        bookingId: body.bookingId,
        amount: body.amount,
        paymentMethod: body.paymentMethod,
        receiptNumber: body.receiptNumber,
        notes: body.notes,
        status: "completed",
      },
    })

    return NextResponse.json({ invoice, payment })
  } catch (error) {
    console.error("[v0] Process payment error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
