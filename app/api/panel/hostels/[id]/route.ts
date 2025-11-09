export const runtime = "nodejs";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: any) {
  try {

    let {id} = await params
    const {status} = await req.json()
    await prisma.hostel.update({
        where:{
            id,
        },
        data:{
            status
        }
    })
    return NextResponse.json({success:true},{status:201})

  }catch(err){
    return NextResponse.json({error:"Server error"},{status:500})
  }
}