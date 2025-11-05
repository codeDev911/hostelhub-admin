"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface AuthUser {
  id: string
  email: string
  hostelOwnerId: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/admin-portal-login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return { user, loading, logout }
}
