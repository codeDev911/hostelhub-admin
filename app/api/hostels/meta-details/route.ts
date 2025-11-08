export const runtime = "nodejs";
export const revalidate = 0
export const dynamic = "force-dynamic"

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


interface HostelMeta {
  title: string;
  description: string;
  keywords: string;
  reviews: number;
  image: string;
  location: string;
  phone: string;
  pricePerMonth: number;
  city:string
}


export async function GET(request: NextRequest) {

  try {

    const url = new URL(request.url);
    const id = url.searchParams.get("id") || ""; 

    let hostel : any = await prisma.hostel.findUnique({
        where:{id},
        select:{
            metaDetails:true,
            address:true,
            city:true,
            images:true,
            phone:true,
            pricePerMonth:true, 
            feedback:{
                where:{
                    type:"review",
                },
                select:{
                    priority:true,
                }
            }
        }, 
        
    })

    if(hostel){
        const avgRating = hostel.feedback ?
  hostel.feedback.reduce((acc:any, f:any) => acc + Number(f.priority), 0) / hostel.feedback.length : 0.0;
        
        
        let details : HostelMeta = {
            title:hostel?.metaDetails?.title ||"",
            city:hostel?.city,
            description:hostel?.metaDetails?.description,
            keywords:hostel?.metaDetails?.keywords,
            image:JSON.parse(hostel?.images?.[0]).url || "",
            location:hostel?.address,
            phone:hostel?.phone,
            pricePerMonth:hostel.pricePerMonth,
            reviews:avgRating
        }
        return NextResponse.json(details,{status:200})
    }else{
        return NextResponse.json({ error: "No hostel founded" }, { status: 400 })
    }

  }catch(e){
    console.log(e);
    
        return NextResponse.json({ error: "Server error" }, { status: 500 })

  }
}