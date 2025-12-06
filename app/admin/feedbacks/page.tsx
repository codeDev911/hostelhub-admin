"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Receipt,
  Loader2,
  EyeIcon,
  MoreVerticalIcon,
  CheckCheckIcon,
} from "lucide-react";
import Link from "next/link";
import FeedbackStatsCard from "@/components/FeedBackStatsCards";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
 

export default function FeedbackManagement() {
  const [filteredResults, setfilteredResults] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterfeedbackStatus, setFilterfeedbackStatus] = useState("");
  const [feedBack, setFeedBack] = useState();
const [markAsReadLoading,setMarkAsReadLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await fetch("/api/admin/feedbacks", {
          method: "GET",
        });

        let data = await res.json();
        setFeedBack(data.stats);
        setfilteredResults(data.stats.allFeedbacks)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAsRead = async(feedbackId:any) =>{
    try {
        setMarkAsReadLoading(true)
    let res = await fetch(`/api/admin/feedbacks/${feedbackId}`,{
            method:"PUT",
            body:JSON.stringify({"status":"reviewed"})
        })

        if(res.ok){
            toast("Marked as reviewed!",{
                description:"Action has successfully performed"
            })
        }else{
            toast("Unknown error occured",{
                description:"An error occured please try again later"
            })

        }
    } catch (error:any) {
        toast("Error occured",{
                description:error.message.text,
                dismissible:true,
            })
        
    }finally{
        setMarkAsReadLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">FeedBacks</h1>
          <p className="text-foreground/60">
            Manage and track all feedbacks (complaints / reviews) across your
            business.
          </p>
        </div>
      </div>

      {/* Feed back summery  */}
      <FeedbackStatsCard stats={feedBack} />

      {/* Filters and Search */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">
            Filters & Search
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Feedbacks
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Student name, email, feedback ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              FeedBack status
            </label>
            <select
              value={filterfeedbackStatus}
              onChange={(e) => setFilterfeedbackStatus(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="reslove">Reslove</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              FeedBack Type
            </label>
            <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent">
              <option value="">All types</option>
              <option value="complaint">Complaints</option>
              <option value="Review">Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* feedbacks Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Priority /ratings
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Text
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResults.length > 0 ? (
                filteredResults.map((feedback:any) => (
                  <tr
                    key={feedback.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {feedback.type.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                        {feedback.priority}
                    </td>
                    <td className="px-6 overflow-hidden truncate max-w-[400px] py-4 text-sm font-semibold text-foreground">
                       <Tooltip>
                        <TooltipTrigger> {feedback.text}</TooltipTrigger>
                        <TooltipContent> {feedback.text}</TooltipContent>
                       </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {feedback.type == "complaint"?
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          feedback.status === "resolved"
                            ? "bg-green-100 dark:bg-green-600 text-green-700 dark:text-green-200"
                            : feedback.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-yellow-200"
                            :feedback.status == "rejected"
                            ? "bg-red-100 dark:bg-red-600 text-red-700 dark:text-red-200"
                            :feedback.status == "reviewed"
                            ? "bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-blue-200":""
                        }`}
                      >
                        {feedback.status}
                      </span>:
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold ">
                        published
                        </span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                       {new Date(feedback?.createdAt || null).toLocaleString("en-US",{
                        year:"numeric",
                        month:"short",
                        day:"numeric"
                       })}

                    </td>
                    <td className="px-6 py-4 text-sm">
                     <Popover>
                        <PopoverTrigger><MoreVerticalIcon className="w-4"/></PopoverTrigger>
                        <PopoverContent className="max-w-[200px]">
                            <h4 className="text-sm font-bold text-primary">Actions</h4>
                            <div className="flex flex-col text-sm text-start ">
                                {feedback.type =="complaint" && feedback.status != "resolved" && feedback.status !== "rejected" && feedback.status != "reviewed" ?<>
                                {markAsReadLoading ?<button  disabled className="px-2 py-1 flex items-center space-x-2 rounded-md bg-secondary">
                                    <Spinner className="w-4"/>
                                    <p>Updating status...</p>
                                </button> :
                                <button onClick={(()=>handleMarkAsRead(feedback.id))} className="px-2 py-1 flex items-center space-x-2 rounded-md hover:bg-secondary">
                                    <CheckCheckIcon className="w-4"/>
                                    <p>Mark as reviewed</p>
                                </button>}</>:""}
                                <button onClick={(()=> location.assign(`/admin/feedbacks/${feedback.id}`))} className="px-2 py-1 flex items-center space-x-2 rounded-md hover:bg-secondary">
                                    <EyeIcon className="w-4"/>
                                    <p>See deatils</p>
                                </button>
                            </div>
                        </PopoverContent>
                     </Popover>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-foreground/60"
                  >
                    No feedbacks found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
