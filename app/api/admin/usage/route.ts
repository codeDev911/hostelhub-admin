export const runtime = "nodejs";
import { NextResponse } from "next/server"; 
import { getSession } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { PLANS } from "@/lib/plansData";

export async function getHostelUsage(hostelId: string, planId: string) {
  const key = `usg:${hostelId}`;
  
  // 1. Fetch all fields from the Redis Hash at once
  const rawData = await redis.hgetall(key);

  // 2. Get the plan limits
  const planLimits = PLANS[planId] || PLANS["Starter"]; // Fallback to free if needed

  // 3. Map keys and calculate percentages
  return {
    rooms: {
      used: parseInt(rawData.rm || "0"),
      limit: planLimits.maxRooms,
    },
    users: {
      used: parseInt(rawData.us || "0"),
      limit: planLimits.maxUsers,
    },
    invoices: {
      used: parseInt(rawData.in || "0"),
      limit: planLimits.maxInvoices,
    },
    payments: {
      used: parseInt(rawData.py || "0"),
      limit: planLimits.maxPayments,
    },
    expenses: {
      used: parseInt(rawData.ex || "0"),
      limit: planLimits.maxExpenses,
    },
    bookings: {
      used: parseInt(rawData.bk || "0"),
      limit: planLimits.maxBookings,
    }
  };
}

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getHostelUsage(
    session.hostelId!, 
    session.planId!
  );

  return NextResponse.json(usage);
}