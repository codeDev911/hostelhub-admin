import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  // 1. Security: Check for Vercel Cron Secret
  // This prevents random people from hitting your reset URL
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Lua script to reset all 'usg:*' keys
    const luaScript = `
      local keys = redis.call('KEYS', 'usg:*')
      for _, key in ipairs(keys) do
        redis.call('HSET', key, 'py', 0, 'ex', 0, 'bk', 0, 'in', 0)
      end
      return #keys
    `;

    const updatedCount = await redis.eval(luaScript, 0);

    return NextResponse.json({ 
      success: true, 
      updated: updatedCount,
      message: "Monthly usage reset complete" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}