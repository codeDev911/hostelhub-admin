import { NextResponse } from "next/server";
import {jwtVerify} from "jose";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret-change-in-production")

export async function POST(req: Request) {
  const { token } = await req.json();

  try {
    const decoded = jwtVerify(token,SECRET) as any;
    return NextResponse.json({ valid: true, hostelId: decoded.hostelId },{status:201});
  } catch (e) {
    return NextResponse.json({ valid: false },{status:500});
  }
}