"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminPortalLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Login failed")
        setIsLoading(false)
        return
      }

      toast.success("Login successful!")
      router.push("/admin")
    } catch (error) {
      console.error("[v0] Login error:", error)
      toast.error("An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-accent/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card with premium styling */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">HostelHub Admin</h1>
            <p className="text-foreground/60 text-sm">Manage your hostel with ease</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background/50 transition-all"
                  placeholder="admin@hostel.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 w-5 h-5 text-foreground/40" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-background/50 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-foreground/40 uppercase tracking-wide">New to HostelHub?</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Footer Links */}
          <div className="space-y-3 text-sm text-center">
            <p className="text-foreground/60">Register as a hostel owner to get started</p>
            <Link
              href="/hostel-registration"
              className="inline-block w-full bg-background/50 border border-border/50 hover:bg-background text-primary font-semibold py-2 rounded-lg transition-colors"
            >
              Register Hostel
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-xs text-foreground/40 mb-2 font-semibold">Demo Credentials:</p>
            <p className="text-xs text-foreground/50">Email: admin@hostel.com</p>
            <p className="text-xs text-foreground/50">Password: admin123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-foreground/40 mt-6">© 2025 HostelHub. All rights reserved.</p>
      </div>
    </div>
  )
}
