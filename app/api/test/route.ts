export const runtime = "nodejs";
import { registrationEmail } from "@/components/mails/registration";
import { sendHtmlEmail } from "@/lib/mailServer";
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
        // let res :any = await sendHtmlEmail({
        //     html:registrationEmail(),
        //     sender:"Booking",
        //     subject:"Your booking has been recieved",
        //     to:"afnanahhad@gmail.com",
        // })

    return NextResponse.json({su:false},{status:200})
}catch(err){
    console.log(err);
    return NextResponse.json({error:err},{status:500})
    
  }
}