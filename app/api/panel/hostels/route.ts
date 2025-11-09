export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    let hostel = await prisma.hostel.findMany({
        orderBy:{
            createdAt:"desc"
        },
        include:{
            owner:{
                select:{
                    address:true,
                    businessType:true,
                    city:true,
                    cnnic:true,
                    email:true,
                    phone:true,
                    isActive:true,
                    isVerified:true,
                    registrationDate:true,
                    ownerName:true
                }
            },
            feedback:{
               where:{
                type:"review",
               },
               select:{
                 priority:true,
               }
            },
            students:{
                select:{
                    _count:true
                }
            },
            rooms:{
                select:{
                    totalSeats:true,
                    students:{
                        select:{
                            id:true
                        }
                    }
                }
            },

        }
    })

    return (NextResponse.json(hostel,{status:200}))

  }catch{
    return NextResponse.json({error:"Server error"},{status:500})
  }
}