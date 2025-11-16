export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendHtmlEmail } from "@/lib/mailServer";
import { bookingEmail } from "@/components/mails/booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const booking = await prisma.booking.create({
      data: {
        studentInformation:body.studentInformation,
        bookingNumber,
        hostelId: body.hostelId,
        roomId: body.roomId,
        roomType: body.roomType,
        numberOfSeats: body.numberOfSeats || 1,
        checkInDate: new Date(body.checkInDate),
        duration: body.duration,
        pricePerMonth: body.pricePerMonth,
        totalPrice: body.totalPrice,
        status: "pending",
      },
      include: {
        hostel: true,
        room: true,
      },
    })

    const room = `#${booking.room.roomNumber} - (${booking.room.roomType}), floor ${booking.room.floor} `

    await sendHtmlEmail({
      html:bookingEmail(booking.hostel.name,booking.hostel.email,booking.hostel.phone,booking.hostel.address,body.studentInformation.phone,body.studentInformation.firstName+" "+body.studentInformation.lastName,body.studentInformation.email,room,booking.pricePerMonth,booking.checkInDate,booking.status),
      sender:"Booking",
      subject:"Your booking has been revieved",
      to:body.studentInformation.email,

    })

 

     
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hostelId = searchParams.get("hostelId")
    const status = searchParams.get("status")

    const bookings = await prisma.booking.findMany({
      where: {
        ...(hostelId && { hostelId }),
        ...(status && { status }),
      },
      include: {
        hostel: true,
        room: true,
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Get bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
