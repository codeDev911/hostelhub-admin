"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, FileText, Phone, MapPin, User, Home, LogOut, Move, Loader2, AlertCircleIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import ShiftRoomModal from "@/components/ShiftRoomModal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import InvoiceDialog from "@/components/GenerateInvoiceModal"

export default function StudentDetails() {
  const params = useParams()
  const studentId = Number(params.id) 
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [revokingLoading,setRevokingLoading]=useState(false)
  useEffect(() => {
    const fetchStudent = async ()=>{

      try {
        setLoading(true)
        const response = await fetch(`/api/admin/students?studentId=${studentId}`)
        const data = await response.json()
        setStudent(data[0])
        
      } catch (error) {
        toast.error("Failed to load rooms")
      } finally {
        setLoading(false)
      }
    }
     fetchStudent()
  }, [])
  
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState("")
  const [LoadingSwitching ,setLoadingSwitching] = useState(false)

  // Handle switching room
  const handleSwitching = async (fromRoomId: string) => {
    try{
      setLoadingSwitching(true)
      let res = await fetch("/api/admin/rooms/shift-to?toRoomId="+selectedRoom,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          studentId: student.id,
          fromRoomId: fromRoomId
        })
      })

      if(res.ok){
        toast.success("Room shifted successfully")
        // Refresh student data
        const response = await fetch(`/api/admin/students?studentId=${studentId}`)
        const data = await response.json()
        setStudent(data[0])
      }else{
        toast.error("Failed to shift room")
      }
    }catch{
      toast.error("Failed to shift room")
    }finally{
      setShowShiftModal(false)
      setLoadingSwitching(false)
    }
  }
  

  const handleRevoke = async()=>{
    try {
      setRevokingLoading(true)
      let res = await fetch(`/api/admin/students/${student.id}`,{
        method:"DELETE",
      })

      if(res.ok){
        setShowRevokeModal(false)
        location.assign("/admin/students")
      }
      
    } catch (error) {
      console.log(error);
      
    }finally{
      setRevokingLoading(false)
    }

  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  } 

    


  if (!student) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/60">Student not found</p>
        </div>
      </>
    )
  }

  const availableRooms = student.hostel?.rooms?.filter((room:any) => room.availableSeats > 0) || []

  return (
    <>
      <div className="min-h-screen  ">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/admin/students" className="flex items-center gap-2 text-accent mb-6 hover:text-accent/80">
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>

          {/* Header with Student Name */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Student details</h1>
            <p className="text-foreground/60">Student ID: #{student.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Full Name</p>
                      <p className="font-semibold text-foreground">{student.firstName + " " + student.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Phone Number</p>
                      <p className="font-semibold text-foreground">{student.phone}</p>
                    </div>
                  </div>
                  {student.email && (
                    <div className="flex items-start gap-4">
                      <span className="text-accent">✉</span>
                      <div>
                        <p className="text-sm text-foreground/60">Email</p>
                        <p className="font-semibold text-foreground">{student.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Permanent Address</p>
                      <p className="font-semibold text-foreground">{student.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CNIC Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">Identification</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60">CNIC Number</p>
                    <p className="font-semibold text-foreground text-lg">{student.cnnic}</p>
                  </div>
                </div>
              </div>

              {/* Father Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                  Father Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Father Name</p>
                      <p className="font-semibold text-foreground">{student.fatherName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Father Phone</p>
                      <p className="font-semibold text-foreground">{student.fatherPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                  Current Room Assignment
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Home className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Hostel</p>
                      <p className="font-semibold text-foreground">{student.hostel?.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Room Details</p>
                    <p className="font-semibold text-foreground">
                      Room {student.room.roomNumber} - Floor {student.room.floor}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Check-in Date</p>
                    <p className="font-semibold text-foreground">{new Date(student.checkInDate).toLocaleString("eu-US",{
                      day:"numeric",
                      month:"long",
                      year:"numeric",
                      hour12:true,
                      hour:"2-digit",
                      minute:"2-digit"
                    })}</p>
                  </div>
                </div>
              </div>

              {/* Payment Invoices */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Payment Invoices
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Month</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {student.invoices?.map((invoice:any) => (
                        <tr title="click to see invoice details" onClick={()=> location.assign(`/admin/invoices/${invoice.id}`)} key={invoice.id} className="hover:bg-secondary/50 cursor-pointer">
                          <td className="px-4 py-3 text-foreground">{new Date(invoice.invoiceYear, invoice.invoiceMonth - 1, 1).toLocaleString("en-US", {  month: "long",})}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">Rs {invoice.amount}</td>
                          <td className="px-4 py-3 text-foreground/70">{new Date(invoice.issuedDate).toLocaleDateString("en-US",{weekday:"short",day:"2-digit"})}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar - Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border sticky top-4">
                <h3 className="text-lg font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">Quick Actions</h3>
                <div className="space-y-3">
                  <ShiftRoomModal buttonTitle="Shift to another room" currentRoom={student.room} varient={"outline"} student_id={student.id}/>
                  <button
                    onClick={() => setShowRevokeModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Revoke {student.firstName} {student.lastName}
                  </button>
                <InvoiceDialog studentId={student.id} studentName={student.firstName+" "+student.lastName}   />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Room Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-primary mb-4">Shift to Another Room</h3>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select Room</option>
              {availableRooms.map((room:any) => (
                <option key={room.id} value={room.id}>
                  Room {room.number} (F{room.floor}) - {room.availableSeats} seats available
                </option>
              ))}
            </select>
            <div className="flex gap-3">
             { LoadingSwitching ? (
              <button
                disabled
                className="flex-1 bg-accent text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </button>
             ) : (
               <button
                onClick={() => {
                  handleSwitching(selectedRoom)
                }}
                className="flex-1 bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-accent/90"
              >
                Confirm Shift
              </button>
             )}
              <button
                onClick={() => setShowShiftModal(false)}
                className="flex-1 border border-border font-semibold py-2 rounded-lg hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-red-600 mb-4">Revoke Student</h3>
            <p className="text-foreground/70 mb-6">
              Are you sure you want to revoke {student.firstName}  {student.lastName} from the hostel? This action cannot be undone.
            </p>
             <Alert variant="default" >
              <AlertCircleIcon  />
              <AlertTitle >Note.</AlertTitle>
              <AlertDescription>
               <p>
                 <strong>Student</strong> and his/her personal info such as <strong>Personal information, Payments, Invoices & Activities</strong> will still saved in our server.

               </p>
               </AlertDescription>
            </Alert>
            <div className="flex gap-3 mt-3">
              {revokingLoading ? 
              <button 
                disabled
                className="flex-1 border border-destructive text-destructive font-semibold py-2 rounded-lg"
              >
                Revoking...
              </button>
              :<button
                onClick={() => {
                  handleRevoke()
                  // Backend will handle revoke
                }}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
              >
                Confirm Revoke
              </button>}
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 border border-border font-semibold py-2 rounded-lg hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
