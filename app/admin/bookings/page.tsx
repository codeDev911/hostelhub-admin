"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, CheckCircle, Clock, Download, Loader2, XIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Booking {
  id: number
  studentInformation: { firstName: string; email: string; phone: string }
  room: { roomNumber: string; roomType: string; floor:string, hostel: { name: string; id: number } }
  status: string
  createdAt: string
  totalPrice: number
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const router = useRouter()
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = new URLSearchParams()
        if (filterHostel) params.append("hostelId", filterHostel)
        if (filterStatus) params.append("status", filterStatus)

        const response = await fetch(`/api/admin/bookings?${params.toString()}`)
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("[v0] Failed to fetch bookings:", error)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [filterHostel, filterStatus])

  useEffect(() => {
    const filtered = bookings?.filter((booking) => {
      const matchesSearch =
        booking.studentInformation.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.studentInformation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.studentInformation.phone.includes(searchTerm)

      return matchesSearch
    })

    setFilteredBookings(filtered)
  }, [bookings, searchTerm])

  const totalBookings = bookings.length
  const confirmedBookings = bookings && bookings?.filter((b) => b.status === "confirmed").length
  const pendingBookings = bookings && bookings?.filter((b) => b.status === "pending").length
  const cancelledBookings = bookings && bookings?.filter((b) => b.status === "cancelled" || b.status === "canceled").length

  const handleExport = () => {
    const csv = [
      ["Student Name", "Email", "Phone", "Hostel", "Room", "Status", "Created Date"],
      ...filteredBookings.map((b) => [
        b.studentInformation.firstName,
        b.studentInformation.email,
        b.studentInformation.phone,
        b.room.hostel.name,
        b.room.roomNumber,
        b.status,
        new Date(b.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Bookings Management</h1>
          <p className="text-foreground/60">Track and manage all hostel bookings</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export to CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-primary mt-2">{totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10  rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Confirmed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{confirmedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingBookings}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Cancelled</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{cancelledBookings}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Filters & Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search Booking</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Student name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-2 text-left text-sm font-semibold text-foreground">Student Name</th>
                <th className="px-6 py-2 text-left text-sm font-semibold text-foreground">Seats</th>
                <th className="px-6 py-2 text-left text-sm font-semibold text-foreground">Room</th>
                <th className="px-6 py-2 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-2 text-left text-sm font-semibold text-foreground">Date</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking:any) => (
                  <tr key={booking.id} onClick={()=>router.push(`/admin/bookings/${booking.id}`)} className="hover:bg-secondary/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      <Link href={`/admin/bookings/${booking.id}`} className="text-primary hover:underline">
                        {booking.studentInformation.firstName}{" "}
                        {booking.studentInformation.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{booking.numberOfSeats}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">#{booking.room.roomNumber} F{booking.room.floor}, {booking.room.roomType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-2 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-orange-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-foreground/60">
                    No bookings found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
