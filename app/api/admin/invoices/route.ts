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

    if (session.hostelId) where.booking = { room: { hostelId: session.hostelId } }
    if (status) where.payments = { some: { status } }
    if (search) {
      where.booking = {
        ...where.booking,
        student: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        },
      }
    }

    const invoices = await prisma.invoice.findMany({
      // where,
      include: {
        student: true,
        payments: true,
      },
    })
    console.log(invoices);
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("[v0] Get invoices error:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
