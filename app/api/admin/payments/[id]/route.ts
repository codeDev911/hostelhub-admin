export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: any) {
    const { searchParams } = new URL(request.url)
    const session = await getSession()
      
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } 
  const {id} = await params
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: {
            student: {
              include:{
                room:true,
              }
            },
            hostel:{
              select:{
                name:true,
                address:true,
                email:true,
                phone:true,
                pricePerMonth:true
              }
            }
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error(" Get payment error:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}


export async function PUT(request: NextRequest, { params }: any) {
  try {
    const session = await getSession()
      
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } 
  
  const {id} = await params //that will be invoice id


  const data = await request.json() 

  await prisma.$transaction(async(prs)=>{
    let invoice = await prs.invoice.update({
      where: {
        id: id
      },
      data:{
        status:data.status
      },
    })

    await prs.payment.updateMany({
      where: {
        invoiceId: invoice.id,
      },
      data
    })
  })



  return NextResponse.json({ success:true}, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
    
  }
}
