import { getUsageDisplayData } from "@/lib/usage-services";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsageCard from "@/components/UsageCharts";
import { PLANS } from "@/lib/plansData";

export default async function PlanPage() {
    const session = await getSession();
    if (!session) {
        return redirect("/admin")
    }
    const usageData = await getUsageDisplayData(session.hostelId!, session.planId!);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
            <div className="">

                {/* Sleek Header */}
                <header className="mb-10 mt-5 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tighter">Plan.</h1>
                        <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                            Monitoring your <span className="text-foreground underline underline-offset-4">{PLANS[session?.planId!].name}</span> environment metrics in real-time.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Active Subscription
                        </div>
                    </div>
                </header>

                {/* Bento Visuals */}<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                    {/* 1. Main Resource (Wide) */}
                    <UsageCard
                        title="Live Capacity"
                        used={usageData[0].used}
                        limit={usageData[0].limit}
                        description="Active room occupancy across all hostel wings."
                        isWide={true}
                    />

                    {/* 2. Secondary Resource (Single) */}
                    <UsageCard
                        title="Revenue flow"
                        used={usageData[3].used} // py (payments)
                        limit={usageData[3].limit}
                        description="Invoiced vs processed payments."
                    />

                    {/* 3. New Row - More Metrics */}
                    <UsageCard
                        title="Student Base"
                        used={usageData[1].used} // us (users)
                        limit={usageData[1].limit}
                        description="Verified student profiles in the system."
                    />

                    {/* 4. Action Card (Keeping your specific status card) */}
                    <div className="lg:col-span-2 bg-accent/30 p-8 rounded-2xl md:flex items-center justify-between border border-white/5">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-medium tracking-tight">Expand Infrastructure</h3>
                            <p className="text-sm text-muted-foreground">Ready to scale? Upgrade your plan to increase all limits instantly.</p>
                        </div>
                        <button className="px-8 py-4 bg-foreground text-background rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                            Upgrade Now
                        </button>
                    </div>

                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {usageData.slice(3).map((item) => (
                        <div
                            key={item.name}
                            className="group relative bg-card backdrop-blur-sm p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-card hover:ring-1 hover:ring-white/10"
                        >
                            {/* Subtle Hover Gradient Mask */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.percentage > 90 ? 'bg-red-500 animate-pulse' : 'bg-primary/40'}`} />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em]">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-medium text-muted-foreground/0 group-hover:text-muted-foreground/100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        METRIC.0{usageData.indexOf(item)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-medium tracking-tighter tabular-nums">
                                            {item.used}
                                        </span>
                                        <span className="text-muted-foreground/70 text-lg font-light tracking-tighter">
                                            / {item.limit}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs text-muted-foreground/60 font-medium tracking-widest uppercase">
                                            {item.percentage}% Load
                                        </span>
                                    </div>

                                    {/* New UI: Segmented Micro-Bar */}
                                    <div className="mt-3 flex gap-1 h-[3px] w-full">
                                        {[...Array(12)].map((_, i) => {
                                            const segmentValue = (i + 1) * (100 / 12);
                                            const isActive = item.percentage >= segmentValue;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-all duration-700 delay-[${i * 50}ms] ${isActive
                                                        ? (item.percentage > 90 ? 'bg-red-500' : 'bg-foreground')
                                                        : 'bg-accent/40'
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}