import { prisma } from "@/lib/prisma";
import {  NextResponse } from "next/server"
export async function GET() {
  try {


    let students = await prisma.student.findMany({
      include: {
        invoices: true,
      },
    })

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

   
    return NextResponse.json({ status: "Invoices generated!", invoices: students});
     
  } catch (error) {
    console.error("[v0] Error generating invoices:", error)
  } finally {
    await prisma.$disconnect()
  }
}
