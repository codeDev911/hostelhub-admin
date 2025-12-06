"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, CheckCircle, Clock, Plus, MoreVertical, Move, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Student {
  id: number
  firstName: string
  email: string
  phone: string
  gender: string
  hostelId: number
  room?: any
  invoices:any
  paymentStatus: string
  checkInDate: string
  hostel?: { name: string }
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGender, setFilterGender] = useState("")
  const [filterPayment, setFilterPayment] = useState("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams()
        if (filterPayment) params.append("paymentStatus", filterPayment)

        const response = await fetch(`/api/admin/students?${params.toString()}`)
        const data = await response.json()
        
        setStudents(data)
        

      } catch (error) {
        console.error("[v0] Failed to fetch students:", error)
        toast.error("Failed to load students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [ filterPayment])

  useEffect(() => {
    
    const filtered = students && students?.length > 0 &&students?.filter((student) => {
      const matchesSearch =
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      const matchesGender = !filterGender || student.gender === filterGender

      return matchesSearch && matchesGender
    })

    setFilteredStudents(filtered || [])
  }, [students, searchTerm, filterGender])

  const totalStudents = students && students?.length || 0
  const activeStudents = students && students?.length>0 && students?.filter((s) => s.paymentStatus === "Paid").length
  const pendingPayments = students && students?.length>0 && students?.filter((s) => s.paymentStatus === "Pending").length

  const router = useRouter()
 

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
          <h1 className="text-4xl font-bold text-primary mb-2">Student Management</h1>
          <p className="text-foreground/60">Manage and track all students in your hostel</p>
        </div>
        <Link
          href="/admin/admit-student"
          className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Admit Student
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-primary mt-2">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Active Students</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Pending Payments</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Status</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check-in</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr onClick={()=>router.push(`/admin/students/${student.id}`)} key={student.id} className="hover:bg-secondary/50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{student.firstName}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{student.phone}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{
                      new Date().toLocaleString("en-US",{
                        day:"2-digit",month:"2-digit",year:"2-digit"
                      })
                    }</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {student?.invoices[0]?.status || "None"} 
                      </span>
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
  )
}
