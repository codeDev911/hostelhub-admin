"use client"

import { useEffect, useState } from "react"
import { Search, Filter, CheckCircle, Clock, AlertCircle, Download, Receipt, Loader2, EyeIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Payment {
  id: number
  amount:number
  invoice: {
    id: number
    student: { firstName: string; email: string; phone: string }
    amount: number
  }
  status: string
  createdAt: string
}

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterHostel, setFilterHostel] = useState("")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("")

  const router = useRouter()

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const params = new URLSearchParams()
        if (filterPaymentStatus) params.append("status", filterPaymentStatus)

        const response = await fetch(`/api/admin/payments?${params.toString()}`)
        const data = await response.json()
        setPayments(data)
        
      } catch (error) {
        toast.error("Failed to load payments, please try again")
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [filterHostel, filterPaymentStatus])

  useEffect(() => {
    const filtered = payments?.filter((payment) => {
      const matchesSearch =
        payment.invoice.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoice.student.phone.includes(searchTerm)

      return matchesSearch
    })

    setFilteredPayments(filtered)
  }, [payments, searchTerm])
  
  const totalRevenue = payments?.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p?.amount, 0)
  const overdueCount = payments.filter((p) => p.status === "overdue").length

  const handleExport = () => {
    const csv = [
      ["Student Name", "Email",   "Amount", "Status", "Date"],
      ...filteredPayments.map((p) => [
        p.invoice.student.firstName,
        p.invoice.student.email,
        p.invoice.amount,
        p.status,
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
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
          <h1 className="text-4xl font-bold text-primary mb-2">Payments & Invoices</h1>
          <p className="text-foreground/60">Manage and track student payments with automated monthly invoicing</p>
        </div>
          <div className="flex space-x-2 items-center">
<button
          onClick={handleExport}
          className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Payments
        </button>
        <Link 
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
         href={"/admin/invoices"}>See invoices</Link>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Total Revenue (Paid)</p>
              <p className="text-3xl font-bold text-green-600 mt-2">Rs {totalRevenue.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-orange-600 mt-2">Rs {pendingPayments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Overdue Invoices</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{overdueCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
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
            <label className="block text-sm font-medium text-foreground mb-2">Search Invoice</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Student name, email, invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Payment Status</label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary/50 cursor-pointer transition-colors" onClick={()=>router.push(`/admin/payments/${payment.id}`)}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {payment.invoice.student.firstName}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      Rs {payment.invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-foreground/60">
                    No payments found matching your filters
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
