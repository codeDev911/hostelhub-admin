export const runtime = "nodejs";
import { registrationEmail } from "@/components/mails/registration";
import { sendHtmlEmail } from "@/lib/mailServer";
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
        let res :any = await sendHtmlEmail({
            html:registrationEmail(),
            sender:"Registration",
            subject:"Your registration has been recieved",
            to:"hostelhubofficial.pk@gmail.com",
            server:"mailtrap"
        })

    return NextResponse.json({res},{status:200})
}catch(err){
    console.log(err);
    return NextResponse.json({error:err},{status:500})
    
  }
}