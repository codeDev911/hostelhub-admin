export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest,{params}:any) {
  try {
    const session = await getSession();
    const {id} = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let expense = await prisma.monthlyExpense.findUnique({
      where: {id:Number(id)},
      include:{
        hostel:{
            select:{
                name:true,
                address:true,
                phone:true,
                email:true
            }
        }
      }
    });

    return NextResponse.json(expense, { status: 200 });
  } catch (e) {
    console.log(e);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest,{params}:any) {
  try {
    const session = await getSession();
    const {id} = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json()
    
    let expense = await prisma.monthlyExpense.update({
      where: {id:Number(id)},
      data:data
    });
    
    return NextResponse.json(expense, { status: 201 });
  } catch (e) {
    console.log(e);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest,{params}:any) {
  try {
    const session = await getSession();
    const {id} = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let expense = await prisma.monthlyExpense.delete({
      where: {id:Number(id)},
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (e) {
    console.log(e);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
