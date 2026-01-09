export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";

 
// Students login
export async function POST(request: NextRequest) {
  try {
    const {email,password} = await request.json() 

    const student = await prisma.student.findFirst({
        where:{
            OR:[
                {email:email},
                {phone:email}
            ]
        }
    })
        
    if(!student){
      
        return NextResponse.json({error:"No user founded! Either user is not registered or provided credentials in wrong"},{status:400})
    }

    const compare = await verifyPassword(password,student.password || "")
    
    if(!compare){
        return NextResponse.json({error:"Email or password in invalid"},{status:401})
        
    }

    let token = await createSession({
      userId:student.id,
      email:student?.email,
      phone:student.phone,
      })

      
  

    return NextResponse.json({sucess:true,message:"User logged in",token:token},{status:201})

  } catch (error) {
    console.error("Student login error : ", error)
    return NextResponse.json({ error: "Server error occured" }, { status: 500 })
  }
}
