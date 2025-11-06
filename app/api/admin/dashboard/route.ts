export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {

    const session = await getSession()
            
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      } 
    

    // Get stats for dashboard
    const totalStudents = await prisma.student.count({
      where:{
        hostelId:session.hostelId!
      }
    })
    const totalRooms = await prisma.room.count({
      where:{
        hostelId:session.hostelId!
      }
    })

    const totalRevenue = await prisma.payment.aggregate({

      _sum: { amount: true },
      where: { AND:[{status: "PAID"},{student:{
        hostelId:session.hostelId
      }}] },
    })

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      where:{
        hostelId:session.hostelId!
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        room: {
          include: { hostel: true },
        },
      },
    })

    // Get occupancy rate
    const rooms = await prisma.room.findMany({
      where:{
        hostelId:session.hostelId!
      },
      select: { totalSeats: true,students:{
        select:{
          id:true
        }
      } },
    })

    const totalSeats = rooms.reduce((sum, room) => sum + room.totalSeats, 0)
    const availableSeats = rooms.reduce((sum, room) => sum + (room.totalSeats - (room?.students?.length||0)), 0)
    const occupiedSeats = rooms.reduce((sum, room) => sum + ((room?.students?.length||0)), 0)
    const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0

    return NextResponse.json({
      totalStudents,
      availableSeats,
      totalRooms,
      totalRevenue: totalRevenue._sum.amount || 0,
      occupancyRate,
      recentBookings,
    })
  } catch (error) {
    console.error("[v0] Dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
