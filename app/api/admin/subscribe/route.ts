export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, getSession } from "@/lib/auth";
import { error } from "console";
import { PLANSID } from "@/lib/plansData";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const { planType, paymentDetails } = await request.json() 
    const planId = PLANSID["premium"]
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let pl = await prisma.plan.update({
      where:{
        adminId:session.adminId!
      },
      data: {
        adminId: session.adminId,
        status: "ACTIVE",
        planType:planType.toUpperCase(),
        paymentDetails,
      },
      select: {
        admin: {
          select: {
            id: true,
            email: true,
            hostelOwnerId: true,
            hostelOwner:{
              select:{
                hostel:{
                  select:{
                    id:true
                  }
                }
              }
            }
          },
          
        },
      },
    });
    await createSession({
      adminId: pl.admin.id,
      email: pl.admin.email,
      planId:planId,
      hostelOwnerId: pl.admin.hostelOwnerId,
      hostelId: pl.admin.hostelOwner.hostel?.id || null,
    });
    return NextResponse.json({ pl }, { status: 201 });
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error }, { status: 500 });
  }
}
