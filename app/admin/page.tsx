"use client"

import { useEffect, useState } from "react"
import { Users, DoorOpen, TrendingUp, ArrowUpRight, Calendar, AlertCircle, Loader2, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DashboardStats {
  totalStudents: number
  availableSeats: number
  totalRooms: number
  totalRevenue: number
  occupancyRate: number
  recentBookings: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load dashboard data</div>
  }

  const dashboardStats = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: ({className}:any)=><Users className={className}/>,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Available Seats",
      value: stats.availableSeats,
      icon: ({className}:any)=><DoorOpen className={className}/>,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      icon: ({className}:any)=><DoorOpen className={className}/>,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: ({className}:any)=><TrendingUp className={className}/>,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's an overview of your hostel management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          return (
            <Card key={index} className="p-4 rounded-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
              <div className="flex items-start justify-between ">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon(`w-6 h-6 bg-linear-to-br ${stat.color} bg-clip-text text-transparent`)}
                </div>
               
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 p-6 rounded-lg border-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Recent Bookings</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
           
              <Table>
                <TableCaption>Showing 5 recents bookings by applicant.</TableCaption>
                <TableHeader>
                  <TableRow className="font-medium">
                    <TableHead className="w-[100px] font-bold"># Room</TableHead>
                    <TableHead className="font-bold">Applicant Name</TableHead>
                    <TableHead className="font-bold">Phone</TableHead>
                    <TableHead className="font-bold">Seats</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.recentBookings && stats?.recentBookings?.slice(0, 5).map((booking, idx) => (
                    <TableRow onClick={()=>location.assign(`/admin/bookings/${booking.id}`)} className="cursor-pointer" title="Click to view details" key={booking?.invoice}>
                      <TableCell className="font-medium">#{booking?.room?.roomNumber} - F {booking.room.floor}</TableCell>
                      <TableCell>{booking?.studentInformation.firstName} {booking?.studentInformation.lastName}</TableCell>
                      <TableCell>{booking?.studentInformation.phone}</TableCell>
                      <TableCell>{booking?.numberOfSeats}</TableCell>
                      <TableCell>
                        {booking?.status == "confirmed" ? <p className="text-green-500">{booking?.status}</p> :  
                        booking?.status == "pending"? <p className="text-yellow-500">{booking?.status}</p>:<p className="text-red-500">{booking?.status}</p>}
                        </TableCell>
                      <TableCell className="text-right">{new Date(booking?.createdAt).toLocaleString("en-US",{
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                      })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                 
              </Table>
          </div>
        </Card>

        {/* Revenue Card */}
        <Card className="p-6 rounded-lg border-0 bg-white">
          <h2 className="text-2xl font-bold text-primary mb-6">Revenue</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-accent">Rs {stats?.totalRevenue?.toLocaleString()}</div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Occupancy</p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-accent to-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${stats.occupancyRate}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-primary mt-2">{stats.occupancyRate}% Full</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 rounded-lg border-0 bg-linear-to-br from-accent/10 to-yellow-100/10">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-primary mb-2">Smarter</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Total {stats.totalStudents} students registered in the system</li>
              <li>
                • {stats.totalRooms} rooms across  hostel
              </li>
              <li>• Current occupancy rate: {stats?.occupancyRate}%</li>
              <li>• Total revenue collected: Rs {stats?.totalRevenue?.toLocaleString()}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
