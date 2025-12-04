export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let expenses = await prisma.monthlyExpense.findMany({
      where: {
        hostelId: session.hostelId!,
      },
      orderBy: {
        createdAt: "desc",
      },
    
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();

    let expense = await prisma.monthlyExpense.create({
      data: {
        ...data,
        hostel: {
          connect: {
            id: session.hostelId!,
          },
        },
      },
    });

    return NextResponse.json(expense, { status: 200 });
  } catch (e) {
    console.log(e);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
