export const runtime = "nodejs";
import { registrationEmail } from "@/components/mails/registration";
import { sendHtmlEmail } from "@/lib/mailServer";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      description,
    } = body;

    // Validation
    if (!ownerName || !email || !phone || !businessName || !cnnic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email or CNIC already exists
    const existing = await prisma.hostelRegistration.findFirst({
      where: {
        AND: [
          {
            status: {
              not: "rejected",
            },
          },
          {
            OR: [{ email }, { cnnic: cnnic }],
          },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email or CNIC already registered" },
        { status: 409 }
      );
    }

    // Create registration
    const registration = await prisma.hostelRegistration.create({
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
        description,
        status: "pending",
      },
    });

    await sendHtmlEmail({
      html: registrationEmail(),
      sender: "Registration",
      subject: "Your registration has beed recieved",
      to: email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        registrationId: registration.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Registration submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
