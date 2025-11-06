export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user: any = JSON.parse(request.headers.get("user") || "");
    const url = new URL(request.url);
    const hostelId = url.searchParams.get("hostelId") || ""; 

    const {type,text,priority,roomDetails} =await request.json()
    
    if (!user) {
      return NextResponse.json({ error: "Un authorieze" }, { status: 401 });
    }
    
    if(!hostelId || !roomDetails.id){
        return NextResponse.json({ error: "No hosetl or room founded" }, { status: 403 });
    }

    await prisma.feedback.create({
        data:{
            student:{
                connect:{
                    id:user.userId
                }
            },
            hostel:{
                connect:{
                    id:hostelId
                }
            },
            roomDetails,
            priority,
            text,
            type
        }
    })
    console.log("Feedback created!");
    
    return NextResponse.json({message:"Feedback submitted success"},{status:201})


  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
