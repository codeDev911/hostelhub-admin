import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret-change-in-production"
);

import type { JWTPayload } from "jose";

export interface SessionData extends JWTPayload {
  adminId: string;
  email: string;
  hostelOwnerId: string;
  hostelId: string | null;
  planId?: string | null;
}

interface ExternalUser extends JWTPayload {
  userId: string;
  email: string;
  phone: string;
}

export async function createSession(data: SessionData) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    
    return payload as SessionData;
  } catch {
    return null;
  }
}

export async function verifyExternalUser(
  token: any
): Promise<ExternalUser | null> {
  let extractToken = token.split(" ")[1]; // e.g Bearer ryKslkdjlkj82kjhasdkjh => ryKslkdjlkj82kjhasdkjh
  const { payload } = await jwtVerify(extractToken, secret);

  return payload as ExternalUser;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

import bcrypt from "bcryptjs";

// Hash password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export const VerifyPanelRequest = async (token: any): Promise<boolean> => {
  try {
    let extractToken = token.split(" ")[1]; // e.g Bearer ryKslkdjlkj82kjhasdkjh => ryKslkdjlkj82kjhasdkjh
    const { payload } = await jwtVerify(extractToken, secret,{ clockTolerance: 5 });   
    
    
    if (payload && payload.email == "admin@hostelhub.pk") {
      return true;
    }
    return false;
  } catch (err) {
    
    return false;
  }
};


// THis is for sending verification link (e.g., email verification, password reset)

export async function createVerificationLink(email:any,purpose:any) {
  const token = await new SignJWT({
    email,
    purpose
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")            // expires in 5 minutes
    .setIssuedAt()
    .sign(secret);

  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-link?token=${token}`;
}

export async function verifyEmailToken(token:any) {
 try {
   const { payload } = await jwtVerify(token, secret);

  if (!payload) {
    throw new Error("Invalid token purpose");
  }

  return payload; // 🎉 verified email
 } catch (error) {
  return null
 }
}