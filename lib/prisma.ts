import { PrismaClient } from "@prisma/client";
export const runtime = "nodejs";

export const prisma = new PrismaClient();
