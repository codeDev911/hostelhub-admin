export const runtime = "nodejs";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"
 
 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email, phone, password, confirmPassword } = body

    if (!token || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Verify token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: {
        hostelRegistration: true,
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 })
    }

    if (verificationToken.usedAt) {
      return NextResponse.json({ error: "Token already used" }, { status: 400 })
    }

    if (new Date() > verificationToken.expiresAt) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    const registration = verificationToken.hostelRegistration

    // Create HostelOwner and Admin account
    const hashedPassword =await hashPassword(password)

    const hostelOwner = await prisma.hostelOwner.create({
      data: {
        ownerName: registration.ownerName,
        email: email,
        phone: phone,
        businessName: registration.businessName,
        businessType: registration.businessType,
        address: registration.address,
        city: registration.city,
        state: registration.state,
        postalCode: registration.postalCode,
        cnnic: registration.cnnic,
        bankAccountHolder: "",
        bankName: "",
        bankAccountNumber: "",
        iban: "",
        isVerified: true,
      },
    })

    // Create hostel 
    const hostel = await prisma.hostel.create({
      data: {
        name: registration.businessName,
        ownerId: hostelOwner.id,
        address: registration.address,
        city: registration.city,
        state: registration.state,
        postalCode: registration.postalCode,
        description: registration.description,
        email: email,
        phone: phone,
      },
    })

    const admin = await prisma.admin.create({
      data: {
        hostelOwnerId: hostelOwner.id,
        email: email,
        password: hashedPassword,
      },
    })

    // Mark token as used
    await prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: {
        usedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      hostelOwner,
      admin,
    })
  } catch (error) {
    console.error("[v0] Account creation error:", error)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
