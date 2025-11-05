export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const url = new URL(request.url);
    const roomShifting = url.searchParams.get("roomShifting");
    const studentId = url.searchParams.get("stdId");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unauthorized no hostel ID were provided insession" }, { status: 401 });
    }
    
    const hostelId = session.hostelId;
    const where: any = {};
    if (hostelId) where.hostelId = hostelId;
    let rooms = [];
    if (roomShifting) {
      rooms = await prisma.room.findMany({
        where: {
          AND: [
            {
              hostelId:hostelId 
            },
            {
              students: { 
                none: {
                  id: studentId || "",
                },
              },
            },
          ],
        },
        include: {
          hostel: true,
          students: {
            select: {
              id: true,
            },
          },
        },
      });
      // Get rooms that are non-full
      const filteredRooms = rooms?.filter((room:any )=> (room.totalSeats - room.students.length) >0)
      return NextResponse.json(filteredRooms);
    }

    rooms = await prisma.room.findMany({
      where,
      include: {
        hostel: true,
        students: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("[v0] Get rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const room = await prisma.room.create({
      data: {
        ...body,
        hostel: {
          connect: { id: session.hostelId! },
        },
      },
      include: { hostel: true },
    });

    

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("[v0] Create room error:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    console.log(updateData);

    const room = await prisma.room.update({
      where: { id: id },
      data: updateData,
      include: { hostel: true },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("[v0] Update room error:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 }
    );
  }
}
