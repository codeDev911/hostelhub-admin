export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth";

 
// Students registration
export async function POST(request: NextRequest) {
  try {
    const {name,password,confirmPassword,...data} = await request.json()
    let firstName = name?.split(" ")[0]
    let lastName = name?.split(" ")[1] || " "
    const hashedPassword = await hashPassword(password)


    const student= await prisma.student.findUnique({
      where:{
        email:data.email
      },
      select:{
        email:true,
        phone:true
      }
    })

    if(student && (student?.email === data.email || student.phone === data.phone)){
      return NextResponse.json({ error: "Email is already registered" }, { status: 403 })
    }

    await prisma.student.create({
        data:{
            ...data,
            firstName,
            lastName,
            password:hashedPassword, 
        },
    }
    )

    return NextResponse.json({sucess:true,message:"Student created success"},{status:201})
  } catch (error) {
    console.error("Student error:", error)
    return NextResponse.json({ error: "Cann't post student" }, { status: 500 })
  }
}
