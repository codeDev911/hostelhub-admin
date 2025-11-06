export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
     const session = await getSession()
    const hostelId = session?.hostelId!
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    } 
    
    if(!session.hostelId){
        return NextResponse.json({ error: "Unrecognized hostel " }, { status: 403 })
    }
 
    // Count totals
    const totalFeedback = await prisma.feedback.findMany({
      where: { hostelId },
      orderBy:{
        createdAt:"desc"
      }
    });

    const totalReviews = await prisma.feedback.count({
      where: { hostelId, type: "review" }
    });

    const totalComplaints = await prisma.feedback.count({
      where: { hostelId, type: "complaint" }
    });

    const avgRatingData : any = await prisma.$queryRaw`
  SELECT AVG(CAST(priority AS INT)) as avgRating
  FROM "Feedback"
  WHERE "hostelId" = ${hostelId} AND "type" = 'review'
    AND priority IN ('1','2','3','4','5')
`;
    const averageRating = Number(avgRatingData[0].avgrating|| 0);
    

    // Positive Review % (4 & 5 stars)
    const positiveReviews = await prisma.feedback.count({
      where: {
        hostelId,
        type: "review",
        priority: { in: ["4", "5"] }
      }
    });

    const positiveReviewPercentage =
      totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

    // Complaint status counts
    const complaintStatuses = await prisma.feedback.groupBy({
      where: { hostelId, type: "complaint" },
      by: ["status"],
      _count: { status: true }
    });

    // Priority breakdown for complaints
    const complaintPriorities = await prisma.feedback.groupBy({
      where: { hostelId, type: "complaint" },
      by: ["priority"],
      _count: { priority: true }
    });

    // AI-style Insight Message
    let summaryMessage = "";
    if (positiveReviewPercentage > 80) {
      summaryMessage = "Great job! Customers are very happy with your service.";
    } else if (positiveReviewPercentage > 60) {
      summaryMessage = "Customers are satisfied. Improve response to complaints.";
    } else {
      summaryMessage = "Customer satisfaction is low. Focus on quality & complaint resolution.";
    }

    return NextResponse.json({
      stats: {
        totalFeedback:totalFeedback?.length,
        allFeedbacks:totalFeedback,
        totalReviews,
        totalComplaints,
        averageRating,
        positiveReviewPercentage,
        complaintStatuses,
        complaintPriorities,
        summaryMessage
      }
    });
  } catch (error) {
    console.error("Feedback Stats Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
