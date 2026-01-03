export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server"
import { createVerificationLink,verifyEmailToken } from "@/lib/auth";
import { sendHtmlEmail } from "@/lib/mailServer";
import { linkVerificationMail } from "@/components/mails/link-verification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email,purpose } = body

    const link = await createVerificationLink(email,purpose);

    if (!link) {
      return NextResponse.json({ error: "Can't generate link" }, { status: 400 })
    }

    // send link in email  
    await sendHtmlEmail({
        to:email,
        html:linkVerificationMail(link),
        sender:"No reply",
        subject:"Your Verification Link",
        server:"zepto"
    })

    return NextResponse.json({ success: true, message: "Verification link sent to email" })


  }catch(error){
    console.error("Generating link error:", error)
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 })
  }
}


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const isValid = await verifyEmailToken(token);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if(isValid.purpose==="reset-student-password"){
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_MARKETING_BASE_URL}/student/reset-password?token=${token}`)
    }else if(isValid.purpose==="reset-admin-password"){
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`)
    }else{
      return NextResponse.json({ success: true, message: "Link verified successfully" ,purpose:isValid?.purpose})
    }



  }catch(error){
    console.error("Verify link error:", error)
    return NextResponse.json({ error: "Failed to verify link" }, { status: 500 })
  }
}