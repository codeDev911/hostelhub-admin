// app/api/upload/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
 
const folder="hostelhub-content"
function generateSignature(timestamp: number) {
  const signatureString = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha1").update(signatureString).digest("hex");
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
        
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length || files.length > 5) {
      return NextResponse.json({ error: "Upload 1-5 images only" }, { status: 400 });
    }

    const uploaded = [] as any[];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const timestamp = Math.floor(Date.now() / 1000);

      
      const params = new URLSearchParams();
      params.append("file", `data:image/jpeg;base64,${base64}`);
      params.append("timestamp", String(timestamp));
      params.append("api_key", process.env.CLOUDINARY_API_KEY!);
      params.append("signature", generateSignature(timestamp));
      params.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: params,
      });
      
      const result = await res.json();
      uploaded.push(result);
    };

    const urls = uploaded.map((r: any) => {
        return{
            "url":r.secure_url,"public_id":r.public_id
        }
    }) 
    let saveData : Array<any> =[]
     uploaded.map((r:any)=>{
        r.secure_url !== "" || r.secure_url !== null?saveData.push(JSON.stringify({
            "url":r.secure_url,
            "public_id":r.public_id
        }))
        :
        null
    })
    
    
    
    await prisma.hostel.update({
        where:{
            id:session.hostelId!,
        },
        data:{
            images:{
                push:saveData
            }
        },
        select:{
            images:true
        }
    })

    return NextResponse.json(urls);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  try {
     const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    const { public_id } = await req.json();

    if (!public_id) {
        console.log("required");
        
      return NextResponse.json({ error: "public_id required" }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = crypto
      .createHash("sha1")   
      .update(`public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
      .digest("hex");

    const params = new URLSearchParams();
    params.append("public_id", public_id);
    params.append("timestamp", timestamp.toString());
    params.append("api_key", process.env.CLOUDINARY_API_KEY!);
    params.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      { method: "POST", body: params }
    );

    const result = await cloudRes.json();

    if (result.result !== "ok") {
        console.log(result);
        
      return NextResponse.json({ error: "Failed to delete image" }, { status: 400 });
    }

    let hostel =await prisma.hostel.findUnique({
        where:{
            id:session.hostelId!
        },
        select:{
            images:true
        }
    })

    let restImages = hostel?.images.filter((img:any)=>{
        let image = JSON.parse(img)
        return image.public_id !== public_id
    })

    let deleted = await prisma.hostel.update({
        where:{
            id:session.hostelId!
        },
        data:{
            images:{
                set:restImages
            }
        },
        select:{
            images:true
        }
    })

    

    return NextResponse.json({ success: true, public_id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}