export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      ownerName,
      email,
      phone,
      businessName,
      businessType,
      address,
      city,
      state,
      postalCode,
      cnnic,
      bankAccountHolder,
      bankName,
      bankAccountNumber,
      iban,
    } = body

    // Check if owner already exists
    const existingOwner = await prisma.hostelOwner.findUnique({
      where: { email },
    })

    if (existingOwner) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create hostel owner
    const owner = await prisma.hostelOwner.create({
      data: {
        ownerName,
        email,
        phone,
        businessName,
        businessType,
        address,
        city,
        state,
        postalCode,
        cnnic,
        bankAccountHolder,
        bankName,
        bankAccountNumber,
        iban,
      },
    })

    return NextResponse.json(owner, { status: 201 })
  } catch (error) {
    console.error("[v0] Hostel registration error:", error)
    return NextResponse.json({ error: "Failed to register hostel owner" }, { status: 500 })
  }
}
