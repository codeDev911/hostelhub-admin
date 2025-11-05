"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { mockStudents, mockHostels } from "@/lib/mock-data"
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Home,
  Calendar,
  DollarSign,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Loader2,
  RotateCw,
  XCircle,
  Check,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function BookingDetails() {
  const params = useParams()
  const router = useRouter()
  const bookingId = String(params.id)
  const [loading,setLoading]= useState(true)
  const [booking,setBooking] = useState({}as any)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [cancelBookingLoading,setCancelBookLoading] = useState(false)

  useEffect(()=>{
    const fetchBookings = async()=>{
      try {
        let res = await fetch(`/api/admin/bookings/${bookingId}`)
        let data = await res.json()
        setBooking(data)
        
      } catch (error) {
        console.log(error);
        
      }finally{
        setLoading(false)
      }
    }
    fetchBookings();
  },[])


   if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )
      } 


  if (!booking && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground/60">Booking not found</p>
      </div>
    )
  }

  const handleBookingStatus = async(status:any)=>{
    try {
      setCancelBookLoading(true)
      let res = await fetch(`/api/admin/bookings/${booking.id}`,{
        method:"PUT",body:JSON.stringify({status:status})
      })

      
      if(res.ok){
        location.reload()
        setShowCancelModal(false)
        return
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      setShowCancelModal(false)
      setCancelBookLoading(false)

    }
  }

  const handleDeleteBooking= async()=>{
    try {
      setCancelBookLoading(true)
      let res = await fetch(`/api/admin/bookings/${booking.id}`,{
        method:"DELETE",
      })

      
      if(res.ok){
        location.assign("/admin/bookings")
        setShowDeleteModal(false)
        return
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      setShowDeleteModal(false)
      setCancelBookLoading(false)

    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/admin/bookings" className="flex items-center gap-2 text-accent hover:text-accent/80">
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Booking #{booking.bookingNumber}</h1>
          <p className="text-foreground/60">Booked on {new Date(booking.createdAt).toLocaleString("en-US",{
            "month":"short",
            day:"2-digit",
            year:"numeric",
            minute:"numeric",
            hour:"numeric",
            hour12:true
          })}</p>
        </div>
      </div>

        {booking.bookingNotes &&
          <Alert>
            <AlertTitle>
              <h4 className="text-sm font-bold">Booking Notes (from applicant)</h4>
            </AlertTitle>
            <AlertDescription>{booking.bookingNotes}</AlertDescription>
          </Alert>
        }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Full Name</p>
                  <p className="font-semibold text-foreground">{booking.studentInformation.firstName} {" "} {booking.studentInformation.lastName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-semibold text-foreground">{booking.studentInformation.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Phone</p>
                  <p className="font-semibold text-foreground">{booking.studentInformation.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">CNIC</p>
                  <p className="font-semibold text-foreground">{booking.studentInformation.cnnic}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 md:col-span-2">
                <MapPin className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Permanent Address</p>
                  <p className="font-semibold text-foreground">{booking.studentInformation.address}</p>
                </div>
              </div>
            </div>
          </div>
 

          {/* Booking Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Home className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Hostel</p>
                  <p className="font-semibold text-foreground">{booking.room.hostel.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Home className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Room Number</p>
                  <p className="font-semibold text-foreground">
                    Room {booking.room.roomNumber} (Floor {booking.room.floor})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-accent text-lg">🏠</span>
                <div>
                  <p className="text-sm text-foreground/60">Room Type</p>
                  <p className="font-semibold text-foreground capitalize">{booking.room.roomType}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Booking Type</p>
                  <p className="font-semibold text-foreground capitalize">{booking.roomType} / {booking.numberOfSeats}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Duration & Pricing */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">Duration & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Check-in Date</p>
                  <p className="font-semibold text-foreground">{new Date(booking.checkInDate).toLocaleString("en-US",{
                    "month":"short",
                    "day":"numeric",
                    "year":"numeric"
                  })}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Duration</p>
                  <p className="font-semibold text-foreground">{booking.duration} months</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <DollarSign className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-foreground/60">Monthly Rate</p>
                  <p className="font-semibold text-foreground">Rs {booking.pricePerMonth.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-accent/10 border border-accent rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Total Booking Amount</p>
                <p className="text-3xl font-bold text-primary">Rs {booking.totalPrice.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-accent opacity-30" />
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-border sticky top-4 space-y-4">
            <h3 className="text-lg font-bold text-primary pb-4 border-b-2 border-secondary">Actions</h3>
            {booking.status == "pending" ?
            <>
            {cancelBookingLoading ?<button  
            className="w-full flex items-center justify-center gap-2 border border-border font-semibold py-2 rounded-lg hover:bg-secondary transition-colors">
              <RotateCw className="w-4 h-4" />
              Processing...
            </button>:<button 
              onClick={(()=>handleBookingStatus("confirmed"))} className="w-full flex items-center justify-center gap-2 border border-border font-semibold py-2 rounded-lg hover:bg-secondary transition-colors">
              <CheckCircle className="w-4 h-4" />
              Confirm booking
            </button>}

            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Cancel Booking
            </button>
            </>
            :
            <>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Booking
            </button>
            <Alert variant={"default"}>
              <AlertTitle className="font-semibold text-base text-primary">Caution!</AlertTitle>
              <AlertDescription className="text-sm text-primary">
                <p>{"You can't update the status of this Booking."}</p>
              </AlertDescription>
            </Alert>
            </>
            }

            {/* Status Summary */}
            <div className="mt-8 pt-6 border-t-2 border-secondary space-y-3">
              <p className="text-sm font-semibold text-foreground/60">Status Info</p>
             
                {booking.status == "pending"?
                 <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <RotateCw className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">{booking.status.toUpperCase()}</span>
                </div>
                : booking.status == "confirmed" ?
                 <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100"> 
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{booking.status.toUpperCase()}</span>
                </div>
                : 
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100"> 
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">{booking.status.toUpperCase()}</span>
                </div>
                } 
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-red-600 mb-4">Cancel Booking</h3>
            <p className="text-foreground/70 mb-6">
              Are you sure you want to cancel this booking for <strong>{booking.studentInformation.firstName} {" "} {booking.studentInformation.lastName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              {
                cancelBookingLoading?<button
                  disabled
                className="flex-1  text-destructive font-semibold py-2 rounded-lg  border-destructive border"
              >
                Canceling...
              </button>:<button
                onClick={() => {
                  handleBookingStatus("cancelled")
                }}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
              >
                Confirm Cancel
              </button>
              }
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-border font-semibold py-2 rounded-lg hover:bg-secondary"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete booking modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-red-600 mb-4">Delete Booking</h3>
            <p className="text-foreground/70 mb-2">
              Are you sure you want to <strong>Delete</strong> this booking for <strong>{booking.studentInformation.firstName} {" "} {booking.studentInformation.lastName}</strong>? This action cannot be undone.
            </p>
            <Alert variant={"destructive"}>
              <AlertTitle className="font-bold">Note!</AlertTitle>
              <AlertDescription>This will parmanently delete the record of this booking from the system. And you wouldn't be able to see after deleting.</AlertDescription>
            </Alert>
            <br />

            <div className="flex gap-3">
              {
                cancelBookingLoading?<button
                disabled
                className="flex-1  text-destructive font-semibold py-2 rounded-lg  border-destructive border"
              >
                Deleting...
              </button>:<button
                onClick={() => {
                  handleDeleteBooking()
                }}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700"
              >
                Delete it
              </button>
              }
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-border font-semibold py-2 rounded-lg hover:bg-secondary"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
