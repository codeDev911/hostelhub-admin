import { PrismaClient } from "@prisma/client";
export const runtime = "nodejs"; // 👈 Add this

export const prisma = new PrismaClient();
