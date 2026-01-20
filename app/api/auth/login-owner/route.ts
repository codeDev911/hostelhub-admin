export const runtime = "nodejs";

import { prisma } from "@/lib/prisma"
import { createSession, verifyPassword } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { PLANSID } from "@/lib/plansData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },

      include: {
        plan:{
          select:{
            planType:true
          }
        },
        hostelOwner: {
          include:{
            hostel:{
              select:{
                id:true
              }
            },
          }
        },
      },
    })
    
    if (!admin) {

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!admin.isActive) {

      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    // Verify password
    const hashedPassword = await verifyPassword(password,admin.password)
    if (!hashedPassword) {
      console.log("no password valid");

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })
    
    const planId = admin?.plan?.planType?.toLowerCase()

    // Create session
    await createSession({
        adminId: admin.id,
        email: admin.email,
        planId:PLANSID[planId?.toLowerCase() ||""],
        hostelOwnerId: admin.hostelOwnerId,
        hostelId: admin.hostelOwner.hostel?.id || null,
      })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        hostelOwnerName: admin.hostelOwner.ownerName,
        businessName: admin.hostelOwner.businessName,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
