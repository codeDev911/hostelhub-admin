export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user: any = JSON.parse(request.headers.get("user") || "");

    if (!user) {
      return NextResponse.json({ error: "Un authorieze" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: {
        id: user?.userId,
      },
      include: {
        hostel: true,
        room: {
          include: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        feedback: true,
        invoices: {
          include: {
            hostel: {
              select: {
                name: true,
                address: true,
                phone: true,
                email: true,
              },
            },
            payments: {
              select: {
                amount: true,
                paymentDate: true,
                paymentMethod: true,
                status: true,
              },
            },
            student: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
                email: true,
                address: true,
                phone: true,
              },
            },
          },
        },
        payments: {
          select: {
            amount: true,
            paymentDate: true,
            paymentMethod: true,
            status: true,
          },
        },
      },
    });

    const { password, ...student_ }: any = student; // extract password and pass student info
    return NextResponse.json(student_, { status: 201 });
  } catch (error) {
    console.error("Get rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user: any = JSON.parse(request.headers.get("user") || "");

    if (!user) {
      return NextResponse.json({ error: "Un authorieze" }, { status: 401 });
    }

    const data = await request.json();

    await prisma.student.update({
      where: {
        id: user.userId,
      },
      data,
    });

    return NextResponse.json({ message: "Student updated" }, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
