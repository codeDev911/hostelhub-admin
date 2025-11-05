export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
     const session = await getSession()
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }

    const hostel = await prisma.hostel.findUnique({
      where: {
        id: session.hostelId ,
      },  
     
    })

    return NextResponse.json(hostel)
    }catch (error) {
        console.error("[v0] Get hostel error:", error)
        return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
    }


}


export async function PUT(request: NextRequest) {
  try {
     const session = await getSession()
        

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 401 })
    }

    const data = await request.json();

    
    await prisma.hostel.update({
        where:{
            id:session.hostelId
        },
        data:{
            ...data,
            pricePerMonth:Number.parseFloat(data.pricePerMonth)
        }
    })
   

    return NextResponse.json({"success":"Hostel updated successfully"},{status:201})
    }catch (error) {
        console.error("[v0] Get hostel error:", error)
        return NextResponse.json({ error: "Failed to fetch hostel" }, { status: 500 })
    }


}