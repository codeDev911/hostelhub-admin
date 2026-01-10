"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
 
import SearchStudentModal from "@/components/SearchStudentModal"
export default function AdmitStudent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    cnnic: "",
    dateOfBirth: "",
    gender: "",
    fatherName: "",
    fatherPhone: "",
    fatherCnic: "",
    fatherOccupation: "",
    roomId: "",
    checkInDate: "",
    city: "",
    state: "",
    postalCode: "",
  })

  const [rooms, setRooms] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
      const fetchRooms = async () => {
        try {
          const response = await fetch(`/api/admin/rooms`)
          const data = await response.json()
          setRooms(data)
        } catch (error) {
          console.error("[v0] Error fetching rooms:", error)
          toast.error("Failed to load rooms")
        }
      }
      fetchRooms()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/students/admit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          checkInDate: new Date(formData.checkInDate).toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to admit student")
        return
      }
      

      setSubmitted(true)
      toast("Student admitted successfully!")
      setTimeout(() => {
        window.location.href = "/admin/students"
      }, 2000)
    } catch (error) {
      console.log(error);
      
      toast("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleData =(data:any)=>{
    setFormData(data)
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/students" className="flex items-center gap-2 text-accent mb-6 hover:text-accent/80">
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>

          {submitted ? (
            <div className="bg-card rounded-lg p-8 text-center shadow-sm border border-border">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-2">Student Admitted Successfully</h2>
              <p className="text-foreground/60 mb-6">The student has been added to the hostel system.</p>
              <p className="text-sm text-foreground/50">Redirecting to student list...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">Admit New Student</h1>
                <p className="text-foreground/60">Fill in the details to admit a student to your hostel</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-4  grid-cols-1">
                <div className="lg:col-span-2">
                  <form
                onSubmit={handleSubmit}
                className="bg-card rounded-lg p-8 shadow-sm border border-border space-y-8"
              >
                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                    Student Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="+92-300-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="student@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Permanent Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter permanent address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">City </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">State </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Postal Code </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                    Identification
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">CNIC Number</label>
                      <input
                        type="text"
                        name="cnnic"
                        value={formData.cnnic}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="XXXXX-XXXXXXX-X"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                    Father Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Father Name *</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter father's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Father Phone </label>
                      <input
                        type="tel"
                        name="fatherPhone"
                        value={formData.fatherPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="+92-300-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Father CNIC</label>
                      <input
                        type="text"
                        name="fatherCnic"
                        value={formData.fatherCnic}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="XXXXX-XXXXXXX-X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Father Occupation</label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Occupation"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary mb-6 pb-4 border-b-2 border-secondary">
                    Room Assignment
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Select Room *</label>
                      <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary"
                      >
                        <option value="">Choose Room</option>
                        {rooms?.map((room: any) => (
                          <option key={room.id} value={room.id}>
                            Room {room.roomNumber} - {room.totalSeats - (room?.students?.length || 0) } seats available
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check-in Date *</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Admitting...
                      </>
                    ) : (
                      "Admit Student"
                    )}
                  </button>
                  <Link
                    href="/admin/students"
                    className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:bg-secondary transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
                </div>

                {/* RIght dev */}
               <div>
                 <div className="bg-card rounded-lg p-8 shadow-sm border border-border  space-y-4">
                  <h2 className="text-xl font-bold text-primary mb-2 pb-2 border-b-2 border-secondary">
                    Admit directly
                  </h2>
                  <p className="text-sm text-foreground">If student in already admitted early or have an account. you can simple add their account to fill student details easily in this form.</p>
                  <SearchStudentModal onSend={handleData}/>
                </div>
               </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
