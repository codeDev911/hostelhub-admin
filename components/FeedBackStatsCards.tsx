import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Star, Sparkles } from "lucide-react";

export default function FeedbackStatsCard({ stats }: any) {
  return (
    <Card className="w-full  rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp size={20} /> Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ratings */}
        <div className="p-4 rounded-xl bg-secondray flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium flex items-center gap-1">
              <Star size={14} /> Avg Rating
            </span>
            <span className="font-bold">
              {stats.averageRating.toFixed(1)} ⭐
            </span>
          </div>
          <Progress value={stats.positiveReviewPercentage} />
          <p className="text-sm text-muted-foreground mt-1">
            {stats.positiveReviewPercentage}% customers are happy
          </p>
        </div>

        {/* Counts */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-muted-foreground">Total Reviews</p>
            <p className="font-bold text-lg">{stats.totalReviews}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-muted-foreground">Total Complaints</p>
            <p className="font-bold text-lg">{stats.totalComplaints}</p>
          </div>
          <div className="space-y-2 p-3 max-md:col-span-2 rounded-xl bg-gray-50 dark:bg-gray-900">
            <p className="font-medium text-sm flex items-center gap-1">
              <AlertTriangle size={14} /> Complaint Status
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.complaintStatuses.map((item: any) => (
                <Badge
                  key={item.status}
                  variant="secondary"
                  className="rounded-full text-[10px]"
                >
                  {item.status}: {item._count.status}
                </Badge>
              ))}
            </div>
          </div>
          {/* Urgency */}{" "}
          <div className="space-y-2 p-3 max-md:col-span-2 rounded-xl bg-gray-50 dark:bg-gray-900">
            <p className="font-medium text-sm">Priority Breakdown</p>
            <div className="flex flex-wrap gap-2">
              {stats.complaintPriorities.map((item: any) => (
                <Badge
                  key={item.priority}
                  variant="outline"
                  className=" rounded-full text-xs "
                >
                  {item.priority}: {item._count.priority}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-sm">
          <div className="flex space-x-1 items-center">
            <Sparkles className="w-4" />
            <h3 className="text-sm font-bold">Smarter</h3>
          </div>
          {stats.summaryMessage}
        </div>
      </CardContent>
    </Card>
  );
}
