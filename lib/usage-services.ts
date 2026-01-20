// lib/usage-service.ts
import { redis } from "./redis";
import { PLANS } from "./plansData";

export async function getUsageDisplayData(hostelId: string, planId: string) {
  const rawData = await redis.hgetall(`usg:${hostelId}`);
  const limits = PLANS[planId] || PLANS["free"];

  const features = [
    { name: "Rooms", key: "rm", limit: limits.maxRooms },
    { name: "Users", key: "us", limit: limits.maxUsers },
    { name: "Invoices", key: "in", limit: limits.maxInvoices },
    { name: "Payments", key: "py", limit: limits.maxPayments },
    { name: "Expenses", key: "ex", limit: limits.maxExpenses },
    { name: "Bookings", key: "bk", limit: limits.maxBookings },
  ];

  return features.map(f => {
    const used = parseInt(rawData[f.key] || "0");
    return {
      name: f.name,
      used,
      limit: f.limit,
      percentage: Math.min(Math.round((used / f.limit) * 100), 100),
    };
  });
}