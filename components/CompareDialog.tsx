"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AxeIcon } from "lucide-react";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartItem {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface Props {
  data: ChartItem[];
}

 export const chartData = [
 { month: "Jan",  year:2026,revenue: 150000, cost: 400000, profit: 70000 },
  { month: "Feb", year:2026, revenue: 165000, cost: 82000, profit: 83000 },
  { month: "Mar", year:2026, revenue: 180000, cost: 90000, profit: 90000 },
  { month: "Apr", year:2026, revenue: 175000, cost: 85000, profit: 10000 },
  { month: "May", year:2026, revenue: 190000, cost: 95000, profit: 95000 },
  { month: "Jun", year:2026, revenue: 120000, cost: 30000, profit: 90000 },
  { month: "Jul", year:2026, revenue: 20000, cost: 10000, profit: 10000 },
  { month: "Aug", year:2026, revenue: 195000, cost: 92000, profit: 103000 },
  { month: "Sep", year:2026, revenue: 185000, cost: 88000, profit: 97000 },
  { month: "Oct", year:2026, revenue: 220000, cost: 110000, profit: 110000 },
  { month: "Nov", year:2026, revenue: 230000, cost: 115000, profit: 115000 },
  { month: "Dec", year:2026, revenue: 250000, cost: 120000, profit: 130000 },
];


const formatRs = (value: number) =>
  `Rs ${new Intl.NumberFormat("en-PK").format(value)}`;


export  function FinanceLineChart({ data }: Props) {
  return (
    <div className="w-full h-80">
       <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            {/* Revenue */}
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>

            {/* Cost */}
           <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>

            {/* Profit */}
             <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.1} />
            </linearGradient>

            
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-300 dark:stroke-neutral-700"
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "var(--foreground)" }}
            stroke="var(--foreground)"
          />

        

          {/* Tooltip (Dark & Light adaptive) */}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              color: "var(--primary)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#revenueGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="cost"
            stroke="url(#costGradient)"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="profit"
            stroke="url(#profitGradient)"
            strokeWidth={3}
            
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


const CompareDialog = ({ expenses }: any) => {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="flex items-center hover:cursor-pointer gap-2 bg-foreground text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-foreground/70 transition-colors">
          <AxeIcon className="w-5 h-5" />
          Compare
        </button>
      </DialogTrigger>
      <DialogContent className="overflow-auto ">
        <DialogHeader>
          <DialogTitle>Compare your expense </DialogTitle>
          <DialogDescription>
            Comparing the finincial activities such as Revenue, Cost and Profit{" "}
            of <strong>12 months</strong>
          </DialogDescription>
        </DialogHeader>
        <div> 
          <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
            <div className="space-y-2 p-3 rounded-xl bg-secondary">
              <p className="text-sm">Total revenue </p>
              <h2 className="text-xl font-semibold text-primary">Rs 48,090</h2>
            </div>
            <div className="space-y-2 p-3 rounded-xl bg-secondary">
              <p className="text-sm">Total expenses </p>
              <h2 className="text-xl font-semibold text-primary">Rs 48,090</h2>
            </div>
            <div className="space-y-2 p-3 rounded-xl bg-secondary">
              <p className="text-sm">Total profit </p>
              <h2 className="text-xl font-semibold text-primary">Rs 48,090</h2>
            </div>
          </div>
          <FinanceLineChart data={chartData}/>
          <div className="mt-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className=" border-b border-border">
                  <tr>
                    <th className="p-2 text-left text-sm font-semibold text-foreground">
                      Month
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-foreground">
                      Revenue (Rs)
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-foreground">
                      Expenses (Rs)
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-foreground">
                      Profit (Rs)
                    </th> 
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className=" transition-colors">
                    <td className="p-2 text-sm font-medium text-foreground">
                      November
                    </td>
                    <td className="p-2 text-sm font-medium text-foreground">
                      1,400,000
                    </td>
                    <td className="p-2 text-sm font-medium text-foreground">
                      450,000
                    </td>
                    <td className="p-2 text-sm font-medium text-foreground">
                      950,000
                    </td>
                  </tr>
                  <tr className="transition-colors bg-secondary">
                    <td className="p-2 py-4 text-sm font-bold text-foreground">
                      Total
                    </td>
                    <td className="p-2 py-4 text-sm font-bold text-foreground">
                      1,400,000
                    </td>
                    <td className="p-2 py-4 text-sm font-bold text-foreground">
                      450,000
                    </td>
                    <td className="p-2 py-4 text-sm font-bold text-foreground">
                      950,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareDialog;
