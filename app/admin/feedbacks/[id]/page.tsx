"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, AlertTriangle, Star, Clock, Loader2,  ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

// props: { feedback }
// feedback = { id,type,priority,text,roomDetails,student,status,createdAt }

export default function FeedbackDetailPage() {
    const params = useParams()
    const feedbackId = String(params.id)
    const [loading,setLoading] = useState(true)
    const [feedback,setFeedback] = useState({}as any)
    const [isComplaint,setisComplaint] = useState(Boolean)
    const [student,setstudent] = useState({}as any)
    const [room,setroom] = useState({}as any)
    const [updateStatusLoading,setUpdateStatusLoading] = useState(false)

    useEffect(()=>{
        const fetchDetails = async () =>{
            try {
                const res = await fetch(`/api/admin/feedbacks/${feedbackId}`,{
                    method:"GET"
                })

                let data = await res.json()
                setFeedback(data)
                console.log(data);
                
                setisComplaint(data.type === "complaint")
                setstudent(data.student)
                setroom(data.roomDetails)
            } catch (error) {
                    console.log(error);
                    
            }finally{
                setLoading(false)
            }
        }
        fetchDetails()
    },[])

    const handleStatusUpdate = async(status:any) =>{
        try {
            setUpdateStatusLoading(true)
            let res = await fetch(`/api/admin/feedbacks/${feedback.id}`,{
                "method":"PUT",
                body:JSON.stringify({status})
            })
            if(res.ok){
                toast("Status updated", {
                description: "Feedback status updated success",
                action:{
                    label:"Reload",
                    onClick:()=>location.reload()
                }
            })
            }
        } catch (error:any) {
             toast("Error occured", {
                description: error?.message?.text,
            })
        }finally{
            setUpdateStatusLoading(false)
        }
    }


    if(loading){
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )
    }

 
  return (
    <div className="max-w-7xl mx-auto space-y-6">
        <div className="">
           <Link href="/admin/feedbacks" className="text-accent flex items-center space-x-1"> 
           <ArrowLeft className="w-4"/>
            <p className="text-sm font-bold">Back to feedbacks</p></Link>
        </div>
        <div className="mb-4">
            <h2 className="text-3xl max-md:text-2xl font-bold">{feedback.type.toUpperCase()} Details</h2>

        </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* Header */}
      <div className="bg-card p-4 rounded-lg">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {student?.firstName?.[0]}
                {student?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">
                {student?.firstName} {student?.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{student?.email}</p>
            </div>
          </div>
          <Badge variant={isComplaint ? "destructive" : "secondary"} className="text-xs">
            {feedback.type.toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Clock size={14} />
            {new Date(feedback.createdAt).toLocaleDateString()}
          </div>

          <Separator />

          {/* Priority / Rating */}
          <div className="flex items-center gap-2">
            {isComplaint ? <AlertTriangle size={16} /> : <Star size={16} />}
            <p className="font-medium">
              {isComplaint ? `Priority: ${feedback.priority}` : `Rating: ${feedback.priority} ⭐`}
            </p>
          </div>

          {/* Message */}
          <div className="mt-4 bg-muted p-4 rounded-xl text-sm">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <MessageSquare size={16} /> Feedback Message
            </div>
            <p className="leading-relaxed">{feedback.text}</p>
          </div>

          {/* Complaint status */}
          {isComplaint && feedback.status && (
            <div className="flex items-center gap-2 font-medium text-sm">
              Status: <Badge variant="outline">{feedback.status}</Badge>
            </div>
          )}
        </div>
      </div>

    <div className="space-y-4">
        {/* Actions */}
         <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold ">Action</h3>
        <Separator className="my-2" />
       {isComplaint &&   feedback.status =="pending" || feedback.status =="reviewed"?
       !updateStatusLoading? <div className="grid grid-cols-2 gap-4 text-sm">
           {feedback.status !== "reviewed" && <Button onClick={()=>handleStatusUpdate("reviewed")} variant={"outline"} className="text-blue-500">Mark as reviewed</Button>}
           <Button onClick={()=>handleStatusUpdate("rejected")} variant={"outline"} className="text-red-500">Mark as rejected</Button>
           <Button onClick={()=>handleStatusUpdate("resolved")} variant={"outline"} className="text-green-500">Mark as resolved</Button>
        </div>:"Updating"
      :"No action can ber performed yet."
      
    }
      </div>
      {/* Room Details */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="text-lg font-semibold ">Room Details</h3>
        <Separator className="my-2" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Room ID:</span> {room.id}</p>
          <p><span className="font-semibold">Room Type:</span> {room.roomType}</p>
          <p><span className="font-semibold">Number:</span> {room.roomNumber}</p>
          <p><span className="font-semibold">Floor:</span> {room.floor}</p>
        </div>
      </div>
    </div>

      </div>
      {/* Student Contact */}
      <div className="p-4 rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-3">Student Contact</h3>
        <Separator className="mb-3" />
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Phone:</span> {student.phone || "N/A"}</p>
          <p><span className="font-semibold">Email:</span> {student.email}</p>
          <p><span className="font-semibold">Student ID:</span> {student.id}</p>
        </div>
      </div>
    </div>
  );
}
