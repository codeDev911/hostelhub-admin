import crypto from "crypto"

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function generateTokenExpiry(hoursValid = 48): Date {
  const now = new Date()
  return new Date(now.getTime() + hoursValid * 60 * 60 * 1000)
}
