export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";
import { redis } from "@/lib/redis";

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
              hostelId: session.hostelId 
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
      orderBy:{
        createdAt:'desc'
      }
    })
    

    return NextResponse.json(payments)
  } catch (error) {
    console.error("[v0] Get payments error:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}


 export function generateTransactionId() {
  const prefix = "TRNX";
  const uniqueNumber = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  // take only the first 11 digits from unique number to make total length = 14
  const finalNumber = uniqueNumber.slice(0, 12);
  return prefix + finalNumber;
}

export async function POST(request: NextRequest) {

  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    const transactionId = generateTransactionId()
    const {invoiceId,studentId,...body} = await request.json()

    

    const payment = await prisma.$transaction(async(tx)=>{
       await tx.payment.create({
         data: {
        ...body,
        student:{
          connect:{
            id:studentId
          }
        },
        invoice:{
          connect:{
            id:invoiceId
          }
        },
        
        transactionId
      },
      include: {
        invoice: {
          include: {
                student: true,
            },
        },
      },
      });
     return await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: body.status },
      })
    })

    // increate payment by 1 in redis for hostel usage
    await redis.hincrby(`usg:${session.hostelId}`,"py",1)

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error(" Create payment error:", error)
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
