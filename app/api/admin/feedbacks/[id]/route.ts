export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest,{params}:any) {
  try {
     const session = await getSession()
    const hostelId = session?.hostelId!

    let {id} = await params
    id= Number.parseInt(id)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }
 
    // Count totals
    const feedback = await prisma.feedback.findFirst({
      where: { AND:[
        {hostelId},
        {id}
      ] }, 
      include:{
        student:{
            select:{
                firstName:true,
                lastName:true,
                id:true,
                phone:true,
                email:true
            }
        },
      }
    });

     return NextResponse.json(feedback || null,{status:200})
  } catch (error) {
    console.error("Feedback Stats Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest,{params}:any) {
  try {
    const session = await getSession()
    const hostelId = session?.hostelId!

    let {id} = await params
    id= Number.parseInt(id)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }
    
    if(!id){
        return NextResponse.json({ error: "No feedback id were provided " }, { status: 400 })

    }

    const data = await request.json()
    
    await prisma.feedback.updateMany({
        where:{
            AND:[
                {hostelId},
                {id}
            ]
        },
        data
    })

      return NextResponse.json({message:"Feedback has been updated"},{status:201})
  } catch (error) {
    console.error("Feedback Stats Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
