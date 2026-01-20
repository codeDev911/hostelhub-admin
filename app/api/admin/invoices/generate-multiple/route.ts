export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateInvoiceNumber } from "../route";
import { centralPlanGuard } from "@/lib/planGuard";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest, { params }: any) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body = await request.json()
    
    const students = await prisma.student.findMany({
        where:{
            AND:[
                {hostelId:session.hostelId},
                {status:"active"}
            ]
        }, 
        
        include:{
            room:{
                select:{
                    pricePerMonth:true
                }
            }
        }
    })

    

     
    const data :any =  []
    students.map((std)=>{
       const invcNo = generateInvoiceNumber()
        data.push({
            amount:std.room?.pricePerMonth,
            dueDate:new Date(body.dueDate),
            hostelId:session.hostelId!,
            invoiceNumber:invcNo,
            invoiceMonth:Number.parseInt(body.invoiceMonth),
            invoiceYear:Number.parseInt(body.invoiceYear),
            studentId:std.id,
            notes:body.notes
        })
    })

    

    await prisma.invoice.createMany({
        data
    })
    
    // increate invoice by data.length in redis for hostel usage
    await redis.hincrby(`usg:${session.hostelId}`,"in",data?.length)
    return NextResponse.json({success:true},{status:201})

  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
