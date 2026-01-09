import { NextResponse } from "next/server";
import {SignJWT} from "jose";
import QRCode from "qrcode"
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret-change-in-production")

export async function GET(req:Request){
    try {
    const session = await getSession()
          
    if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }

    const url = await prisma.hostel.findFirst({
        where:{
            id:session.hostelId!
        },
        select:{
            formFillUrl:true
        }
    })

    if(!url?.formFillUrl){        
        return NextResponse.json({ message:"no qr code founded"},{status:400});
    }
    
    const qr = await QRCode.toDataURL(url?.formFillUrl||"");

    return NextResponse.json({ qr,url:url.formFillUrl},{status:201});
} catch (error) {
      return NextResponse.json({ error:"Server error" },{status:500});
    
}
}

export async function POST(req: Request) {
  try {
     const session = await getSession()
          
    if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }

    const data : any = session.hostelId

    const token = await new SignJWT({id:data})
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET)

  const url = `${process.env.NEXT_PUBLIC_MARKETING_BASE_URL}/students/verify-admission-token?token=${token}`;

  const qr = await QRCode.toDataURL(url);

  await prisma.hostel.update({
    where:{
        id:session.hostelId!
    },
    data:{
        formFillUrl:url
    }
  })

  return NextResponse.json({ qr,url },{status:201});
} catch (error) {
    console.log(error);
    
      return NextResponse.json({ error:"Server error" },{status:500});
    
  }
}
