export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getRoomCapacity } from "@/lib/room-capicity";



export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    let {floor,numberOfrooms,pricePerMonth,roomType} = await request.json()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.hostelId) {
      return NextResponse.json(
        { error: "Unauthorized no hostel ID were provided insession" },
        { status: 401 }
      );
    }

    // We are getting this as string eg '14000' , converted to number as 14000
    pricePerMonth = Number.parseInt(pricePerMonth)

    const rooms = Array.from({ length: numberOfrooms }, (_, i) => ({
        hostelId:session.hostelId!,
        pricePerMonth:pricePerMonth,
        roomType:roomType,
        roomNumber : `${i+1}`,
        floor:floor,
        totalSeats:getRoomCapacity(roomType),
    }));

    

    await prisma.room.createMany({
        data:rooms
    })

    return NextResponse.json({ success:true,message:"Multiple rooms created" }, { status: 201 });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: `Server error : ${e}` }, { status: 500 });
  }
}
