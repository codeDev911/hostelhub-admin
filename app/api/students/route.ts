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
    await prisma.student.create({
        data:{
            ...data,
            firstName,
            lastName,
            password:hashedPassword,
            fatherName:"",
            fatherPhone:""
        },
    }
    )

    return NextResponse.json({sucess:true,message:"Student created success"},{status:201})
  } catch (error) {
    console.error("[v0] Get rooms error:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
