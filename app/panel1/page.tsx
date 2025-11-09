"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Registration {
  id: string
  ownerName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  city: string
  address: string
  postalCode: string
  cnnic: string
  status: string
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  verificationToken?: {
    token: string
    expiresAt: string
    usedAt?: string
  }
}

export default function ControlPanelPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const adminEmail = "admin@hostelhub.com" // Replace with actual admin email from session

  useEffect(() => {
    fetchRegistrations()
  }, [filter])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/registrations?status=${filter}`)
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch (error) {
      console.error("[v0] Fetch error:", error)
      toast.error("Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reg: Registration) => {
    try {
      setApproveLoading(true)
      const res = await fetch(`/api/registrations/${reg.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewedBy: adminEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to approve")
        return
      }

      setSelectedReg(data.registration)
      toast.success("Registration approved! Token generated.")
      fetchRegistrations()
    } catch (error) {
      console.error("[v0] Approve error:", error)
      toast.error("Failed to approve registration")
    } finally {
      setApproveLoading(false)
    }
  }

  const handleReject = async (reg: Registration) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    try {
      setActionLoading(true)
      const res = await fetch(`/api/registrations/${reg.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewedBy: adminEmail,
          rejectionReason,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to reject")
        return
      }

      toast.success("Registration rejected")
      setRejectionReason("")
      setSelectedReg(null)
      fetchRegistrations()
    } catch (error) {
      console.error("[v0] Reject error:", error)
      toast.error("Failed to reject registration")
    } finally {
      setActionLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">HostelHub Control Panel</h1>
          <p className="text-muted-foreground">Review and manage hostel registration requests</p>
        </div>

        {/* Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registration List */}
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </CardContent>
              </Card>
            ) : registrations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">No {filter} registrations</CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <Card
                    key={reg.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedReg(reg)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{reg.businessName}</h3>
                          <p className="text-sm text-muted-foreground">{reg.ownerName}</p>
                        </div>
                        {getStatusBadge(reg.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{reg.email}</span> • {reg.phone}
                      </p>
                      <p className="text-muted-foreground">
                        {reg.address}, {reg.city} {reg.postalCode}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(reg.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel */}
          {selectedReg ? (
            <Card>
              <CardHeader>
                <CardTitle>Registration Details</CardTitle>
                <CardDescription>{selectedReg.businessName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Owner Info */}
                <div>
                  <h4 className="font-bold text-sm mb-3">Owner Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {selectedReg.ownerName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {selectedReg.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {selectedReg.phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">CNIC:</span> {selectedReg.cnnic}
                    </p>
                  </div>
                </div>

                {/* Hostel Info */}
                <div>
                  <h4 className="font-bold text-sm mb-3">Hostel Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Type:</span> {selectedReg.businessType}
                    </p>
                    <p>
                      <span className="text-muted-foreground">City:</span> {selectedReg.city}
                    </p>
                    <p className="text-muted-foreground">
                      <span>Address:</span> {selectedReg.address}, {selectedReg.postalCode}
                    </p>
                  </div>
                </div>

                {/* Verification Token */}
                {selectedReg.verificationToken && !selectedReg.verificationToken.usedAt && (
                  <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                    <p className="text-sm font-bold text-green-900 mb-2">Verification Link</p>
                    <div className="bg-white border border-green-100 rounded p-2 text-xs break-all font-mono mb-2">
                      {window.location.origin}/verify-account/{selectedReg.verificationToken.token}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/verify-account/${selectedReg?.verificationToken?.token}`,
                        )
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                )}

                {selectedReg.verificationToken?.usedAt && (
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                    <p className="text-sm font-bold text-blue-900">Account Created</p>
                    <p className="text-xs text-blue-700">
                      {new Date(selectedReg.verificationToken.usedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedReg.status === "rejected" && selectedReg.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                    <p className="text-sm font-bold text-red-900">Rejection Reason</p>
                    <p className="text-sm text-red-700">{selectedReg.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                {selectedReg.status === "pending" && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(selectedReg)}
                      disabled={approveLoading}
                    >
                      {approveLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>

                    <div className="space-y-2">
                      <textarea
                        placeholder="Rejection reason (if rejecting)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-sm text-sm resize-none focus:outline-none focus:border-accent"
                        rows={3}
                      />
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleReject(selectedReg)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Select a registration to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
