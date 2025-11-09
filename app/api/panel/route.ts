export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {


    let data = async()=>{
        let hostelRegistrations = await prisma.hostelRegistration.findMany({
            orderBy:{
                createdAt:"desc"
            },
            take:20
        })

        let hostels = await prisma.hostel.count()

        let students = await prisma.student.count()
        let bookings = await prisma.booking.count()

        let invoices = await prisma.invoice.count()

        return{
            hostelRegistrations,
            students,
            invoices,
            hostels,
            bookings
        }
    }

    
    return NextResponse.json({data:await data()},{status:200})

  }catch(err){
    
    return NextResponse.json({error:"Server error"},{status:500})
  }
}