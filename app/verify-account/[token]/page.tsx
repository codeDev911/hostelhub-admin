"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner" 

interface Registration {
  id: string
  ownerName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  city: string
}

export default function VerifyAccountPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"verify" | "create">("verify")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/verify-token?token=${token}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid or expired token")
        setStep("verify")
        return
      }

      setRegistration(data.registration)
      setFormData((prev) => ({
        ...prev,
        email: data.registration.email,
        phone: data.registration.phone,
      }))
      setStep("create")
    } catch (err) {
      console.error("[v0] Token verification error:", err)
      setError("Failed to verify token")
      setStep("verify")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return false
    }

    return true
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setVerifying(true)
      const res = await fetch("/api/owner-account/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to create account")
        return
      }

      toast.success("Account created successfully!")
      setTimeout(() => {
        router.push("/admin-portal-login")
      }, 2000)
    } catch (err) {
      console.error("[v0] Account creation error:", err)
      toast.error("Failed to create account")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-muted-foreground">Verifying your token...</p>
          </div>
        </div>
        
      </main>
    )
  }

  if (step === "verify" || error) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Verification Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button className="w-full" onClick={() => router.push("/hostel-registration")}>
                Back to Registration
              </Button>
            </CardContent>
          </Card>
        </div>
        
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      

      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Create Your Account
            </CardTitle>
            <CardDescription>Complete the registration to access your hostel admin panel</CardDescription>
          </CardHeader>

          <CardContent>
            {registration && (
              <div className="bg-secondary rounded-sm p-4 mb-6">
                <h3 className="font-bold text-sm mb-2">{registration.businessName}</h3>
                <p className="text-xs text-muted-foreground">{registration.ownerName}</p>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Email - Read Only */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-sm bg-secondary text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Phone - Read Only */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-sm bg-secondary text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Create Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min 8 characters)"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:border-accent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:border-accent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={verifying}>
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              After creating your account, you can log in to access your admin panel.
            </p>
          </CardContent>
        </Card>
      </div>

      
    </main>
  )
}
