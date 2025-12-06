export const runtime = "nodejs";
import { RegistrationRejectedEmail } from "@/components/mails/registration";
import { sendHtmlEmail } from "@/lib/mailServer";
import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { reviewedBy, rejectionReason } = JSON.parse(body)

    if (!reviewedBy || !rejectionReason) { 
      
      return NextResponse.json({ error: "Reviewer and rejection reason are required" }, { status: 400 })
    }

    const updated = await prisma.hostelRegistration.update({
      where: { id },
      data: {
        status: "rejected",
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason,
      },
    })


    await sendHtmlEmail({
      html:RegistrationRejectedEmail(updated?.rejectionReason||"Your provided information is not valid",updated.businessName),
      sender:"Registration",
      subject:"Your registration status",
      to:updated.email
    })

    return NextResponse.json({
      success: true,
      message: "Registration rejected",
      registration: updated,
    })
  } catch (error) {
    console.error("[v0] Rejection error:", error)
    return NextResponse.json({ error: "Failed to reject registration" }, { status: 500 })
  }
}
