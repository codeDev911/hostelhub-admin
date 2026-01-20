"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  description: string;
  isWide?: boolean;
}

export default function UsageCard({ title, used, limit, description, isWide = false }: UsageCardProps) {
  const percentage = Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className={`${isWide ? 'lg:col-span-2' : 'col-span-1'} bg-card p-8 rounded-2xl flex items-center justify-between overflow-hidden relative group transition-all `}>
      <div className="relative z-10">
        <h3 className="text-muted-foreground mb-2 text-[10px] font-bold uppercase tracking-[0.25em] ">
          {title}
        </h3>
        <p className="md:text-5xl text-3xl font-medium tracking-tighter tabular-nums">
          {used}
          <span className="text-muted-foreground/70  font-light ml-1">/ {limit}</span>
        </p>
        <p className="text-sm text-muted-foreground/60 mt-4 max-w-[200px] leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="md:h-48  w-30 md:w-48 h-30  relative">
        <ResponsiveContainer className={"md:hidden"} width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { value: used },
                { value: Math.max(0, limit - used) }
              ]}
              innerRadius={35}
              outerRadius={50}
              stroke="none"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="currentColor" className="text-foreground" />
              <Cell fill="currentColor" className="text-accent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer className={"max-md:hidden"} width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { value: used },
                { value: Math.max(0, limit - used) }
              ]}
              innerRadius={45}
              outerRadius={75}
              stroke="none"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="currentColor" className="text-foreground" />
              <Cell fill="currentColor" className="text-accent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-medium tracking-tighter tabular-nums">{percentage}%</span>
          <p className="text-[8px] text-muted-foreground/50 uppercase tracking-widest font-bold">Load</p>
        </div>
      </div>
    </div>
  );
}