export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";
import { generateTransactionId } from "../payments/route";

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

    where.hostelId = session.hostelId
    if (status) where.payments = { some: { status } }
    if (search) {
        where.student =  {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: {
          select:{
            id:true,
            firstName:true,
            lastName:true,
          }
        },
      },
      orderBy:{
        createdAt:'desc'
      }
    })
    // console.log(invoices);
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("[v0] Get invoices error:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

 export function generateInvoiceNumber() {
  const prefix = "INV";
  const uniqueNumber = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  // take only the first 11 digits from unique number to make total length = 14
  const finalNumber = uniqueNumber.slice(0, 14);
  return prefix + finalNumber;
}

export async function POST(request: NextRequest) {
  try {
     const session = await getSession()
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    const {studentId, ...data} = await request.json()
    
    const invoiceNumber  = generateInvoiceNumber()

    const invoice = await prisma.invoice.create({
      data:{
        student:{
          connect:{
            id:studentId,
          }
        },
        hostel:{
          connect:{
            id:session.hostelId!,
          }
        },  
        invoiceNumber,
        ...data
      }
    })
    
    // create payments if the invoice status is paid
    if(invoice.status == 'paid'){
      const trxId = generateTransactionId()
      await prisma.payment.create({
        data:{
           student:{
          connect:{
            id:studentId,
          }
        },
        amount:invoice.amount,
        paymentMethod:"Others",
        invoice:{
          connect:{
            id:invoice.id
          }
        },
        paymentDate:new Date(),
        receiptNumber:"",
        status:invoice.status,
        transactionId:trxId,
        notes:invoice.notes,
        }
      })
    }

    
    
    return NextResponse.json({sucess:true},{status:201})
  } catch (error) {
    console.error("Get invoices error:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
