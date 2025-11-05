"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2, BedIcon, CheckCheck, HashIcon, Building, BedDouble, PenIcon, MoreVertical } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ShiftRoomModal from "@/components/ShiftRoomModal"

export default function RoomDetails() {
  const params = useParams()
  const roomId = params.id
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState<any>(null)
  const [moreModal, setMoreModal] = useState({
    is_active: false,
    student_name: "",
    student_id: ""

  })
  useEffect(() => {
    const fetchRooms = async () => {

      try {
        setLoading(true)
        const response = await fetch(`/api/admin/rooms/${roomId}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch room details")
        }
        setRoom(data)
      } catch (error) {
        toast.error("Failed to load rooms")
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])





  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }




  if (!room) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/60">Room not found</p>
        </div>
      </>
    )
  }


  return (
    <>
      <div className="min-h-screen  ">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/admin/rooms" className="flex items-center gap-2 text-accent mb-6 hover:text-accent/80">
            <ArrowLeft className="w-4 h-4" />
            Back to rooms
          </Link>

          {/* Header with  Name */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Room details</h1>
            <p className="text-foreground text-base  font-medium">ID : {room.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                  Room Information
                </h2>
                <div className="space-y-4 grid md:grid-cols-3 grid-cols-2 gap-2">
                  <div className="flex items-start gap-4">
                    <BedIcon className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Total seats</p>
                      <p className="font-semibold text-foreground">{room.totalSeats}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCheck className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Available seats</p>
                      <p className="font-semibold text-foreground">{room.totalSeats - (room.students.length || 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <HashIcon className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Room number</p>
                      <p className="font-semibold text-foreground">{room.roomNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Building className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">On floor</p>
                      <p className="font-semibold text-foreground">{room.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BedDouble className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Type</p>
                      <p className="font-semibold text-foreground">{room.roomType}</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                  Students ({room.students.length})
                </h2>
                <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                  <div className="overflow-x-auto z-0">
                    <table className="w-full z-0">
                      <thead className="bg-secondary border-b border-border">
                        <tr>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground">Name</th>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground">Email</th>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground">Phone</th>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground text-nowrap">Check-in</th>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground">Payment</th>
                          <th className="px-6 py-2.5 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {room.students.length > 0 ? (
                          room.students.map((student: any) => (
                            <tr key={student.id} className="hover:bg-secondary/50 transition-colors">
                              <td className="px-6 py-2.5 text-sm font-medium text-foreground">{student.firstName}</td>
                              <td className="px-6 py-2.5 text-sm text-foreground/70">{student.email}</td>
                              <td className="px-6 py-2.5 text-sm text-foreground/70">{student.phone}</td>
                              <td className="px-6 py-2.5 text-sm text-foreground/70 text-nowrap">{new Date(student.checkInDate).toLocaleString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",

                              })}</td>
                              <td className="px-6 py-2.5 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${student?.invoices[0]?.status === "Paid"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                    }`}
                                >
                                  {student?.invoices[0]?.status}
                                </span>
                              </td>
                              <td className="px-6 z-0 relative py-2.5 text-sm text-foreground/70">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <button 
                                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                    title="More Actions"
                                >
                                  <MoreVertical className="w-4 h-4 text-foreground/60" />
                                </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <ShiftRoomModal varient={"ghost"} buttonTitle="Shift room" currentRoom={room} student_id={student.id}/>
                                    <DropdownMenuItem>
                                      <Link href={`/admin/students/${student.id}`}>View details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive">Revoke </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                               

                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-foreground/60">
                              No students found matching your filters
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
 
 
                
              </div>
            </div>

            {/* Sidebar - Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-border sticky top-4">
                <h3 className="text-lg font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    // onClick={() => setShowShiftModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    <PenIcon className="w-4 h-4" />
                    Edit room
                  </button>

                </div>


              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
