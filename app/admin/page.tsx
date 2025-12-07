"use client";

import { useEffect, useState } from "react";
import {
  Users,
  DoorOpen,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  AlertCircle,
  Loader2,
  Sparkles,
  BedIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { chartData, FinanceLineChart } from "@/components/CompareDialog";

interface DashboardStats {
  totalStudents: number;
  availableSeats: number;
  totalRooms: number;
  totalRevenue: number;
  occupancyRate: number;
  recentBookings: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">Failed to load dashboard data</div>
    );
  }

  const dashboardStats = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: ({ className }: any) => <Users className={className} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-600",
    },
    {
      label: "Available Seats",
      value: stats.availableSeats,
      icon: ({ className }: any) => <BedIcon className={className} />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-600",
    },
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      icon: ({ className }: any) => <DoorOpen className={className} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-600",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: ({ className }: any) => <TrendingUp className={className} />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-600",
    },
  ];

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
            <div
              key={index}
              className="p-4 rounded-lg transition-all duration-300  bg-card"
            >
              <div className="flex items-start justify-between ">
                <div className="">
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <div className={`p-2 w-11 mt-2 rounded-lg ${stat.bgColor}`}>
                    {stat.icon(
                      `w-6 h-6 bg-linear-to-br ${stat.color} bg-clip-text text-transparent`
                    )}
                  </div>
                </div>

                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-3 bg-card   rounded-lg">
          <h3 className="text-xl font-bold text-primary px-2 pt-3">
            Finincial chart
          </h3>
          <p className="text-muted-foreground px-2 pb-3">
            This chart compare finincial activities such as{" "}
            <strong>Revenue, Cost & Profit</strong> of last 12 months{" "}
          </p>
          <FinanceLineChart data={chartData} />
        </div>
        <div className="space-y-4">
          <div className="p-4  rounded-lg bg-card">
            <h2 className="text-lg font-bold text-primary mb-2">Revenue</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-accent">
                  Rs {stats?.totalRevenue?.toLocaleString()}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">This year</p>
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
                <p className="text-sm font-semibold text-primary mt-2">
                  {stats.occupancyRate}% Full
                </p>
              </div>
            </div>
          </div>
          {/* Smarter */}
          <div className="p-4 rounded-lg bg-card">
            <div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <h3 className="font-bold text-primary mb-2">Smarter</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  Total {stats.totalStudents} students registered in the system
                </li>
                <li>{stats.totalRooms} rooms across hostel</li>
                <li>Current occupancy rate: {stats?.occupancyRate}%</li>
                <li>
                  Total revenue collected: Rs{" "}
                  {stats?.totalRevenue?.toLocaleString()}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold  pb-3">Recent bookings</h2>
          <div className="bg-card  rounded-lg   overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Room #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Applicant Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats?.recentBookings.length > 0 ? (
                    stats?.recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() =>
                          router.push(`/admin/bookings/${booking.id}`)
                        }
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          #{booking.room.roomNumber}-f{booking.room.floor}
                        </td>
                        <td className="px-6 py-4 text-sm  text-foreground">
                          {booking.studentInformation.firstName}{" "}
                          {booking.studentInformation.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm  text-foreground">
                          {booking?.studentInformation?.phone}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs  ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
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
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-foreground/60"
                      >
                        No payments found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
