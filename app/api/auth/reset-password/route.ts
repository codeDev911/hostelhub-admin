export const runtime = "nodejs";
import { hashPassword, verifyEmailToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"
 

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const { token,password } = body

    if (!token || !password) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    const isValid = await verifyEmailToken(token);

    if (!isValid || typeof isValid !== 'object' || !('email' in isValid)) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password);
    await prisma.$transaction(async(tx)=>{

      const user  = await tx.student.findFirst({
         where: {  email: (isValid as { email: string }).email},
         select:{
          phone:true
         }
      })

      if(user){
        await tx.student.update({
          where:{
            phone : user?.phone || ""
          },
          data:{
            password:hashedPassword
          }
        })
      }

    })

    return NextResponse.json({ success: true, message: "Password reset successfully" })

  }catch(error){
    console.error("Ressetting password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}