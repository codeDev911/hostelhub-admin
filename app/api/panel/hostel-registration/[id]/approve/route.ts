export const runtime = "nodejs";
import { RegistrationApprovedEmail } from "@/components/mails/registration";
import { sendHtmlEmail } from "@/lib/mailServer";
import { prisma } from "@/lib/prisma"
import { generateSecureToken, generateTokenExpiry } from "@/lib/token-utils"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { reviewedBy } = body

    if (!reviewedBy) {
      return NextResponse.json({ error: "Reviewer email is required" }, { status: 400 })
    }

    // Get registration
    const registration = await prisma.hostelRegistration.findUnique({
      where: { id },
    })

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Generate verification token
    const token = generateSecureToken()
    const expiresAt = generateTokenExpiry(48) // 48 hours valid


    // Update registration status and create token
    const updated = await prisma.hostelRegistration.update({
      where: { id },
      data: {
        status: "approved",
        reviewedBy,
        reviewedAt: new Date(),
        verificationToken: {
          create: {
            token,
            expiresAt,
          },
        },
      },
      include: {
        verificationToken: true,
      },
    })

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-token/${updated.verificationToken?.token}`

    await sendHtmlEmail({
      html:RegistrationApprovedEmail(verificationLink,updated.businessName),
      sender:"Registration",
      subject:"Congratulations! your hostel has been approved",
      to:updated.email
    })

    return NextResponse.json({
      success: true,
      message: "Registration approved",
      verificationLink: `/verify-account/${token}`,
      registration: updated,
    })
  } catch (error) {
    console.error("[v0] Approval error:", error)
    return NextResponse.json({ error: "Failed to approve registration" }, { status: 500 })
  }
}
