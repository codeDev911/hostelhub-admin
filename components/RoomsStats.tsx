import React, { useMemo } from "react";
import { LayoutDashboard, Bed, DoorOpen, Layers } from "lucide-react";

export default function RoomStats({ rooms }: { rooms: any[] }) {
  const stats = useMemo(() => {
    if (!rooms) return null;

    // Structure to hold data for each floor
    const floors: Record<string, { totalRooms: number; totalSeats: number; availableSeats: number }> = {};
    let totalRooms = rooms.length;
    let totalSeats = 0;
    let totalOccupied = 0;

    rooms.forEach((room) => {
      const floorName = room.floor || "Unknown";
      const occupied = room.students?.length || 0;
      const available = room.totalSeats - occupied;

      if (!floors[floorName]) {
        floors[floorName] = { totalRooms: 0, totalSeats: 0, availableSeats: 0 };
      }

      // Update Floor Totals
      floors[floorName].totalRooms += 1;
      floors[floorName].totalSeats += room.totalSeats;
      floors[floorName].availableSeats += available;

      // Update Global Totals
      totalSeats += room.totalSeats;
      totalOccupied += occupied;
    });

    return {
      totalRooms,
      totalSeats,
      availableSeats: totalSeats - totalOccupied,
      floorData: Object.entries(floors).sort() // Sorting by floor name
    };
  }, [rooms]);

  if (!stats) return null;

  return (
    <div className="bg-card rounded-xl  overflow-hidden">
      {/* Card Header & Global Stats */}
      <div className="p-6 border-b border-border bg-secondary/10">
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-primary">Hostel Occupancy Overview</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Rooms</p>
            <p className="text-2xl font-bold text-primary">{stats.totalRooms}</p>
          </div>
          <div className="space-y-1 border-x border-border px-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Capacity</p>
            <p className="text-2xl font-bold text-primary">{stats.totalSeats}</p>
          </div>
          <div className="space-y-1 px-4">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Available</p>
            <p className="text-2xl font-bold text-green-600">{stats.availableSeats}</p>
          </div>
        </div>
      </div>


      <h3 className="text-base px-4 pt-3 font-bold">Rooms on floor</h3>
      <div className="flex gap-2 p-4 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {stats.floorData.map(([floor, data]) => (
          <div
            key={floor}
            className="flex-shrink-0 flex flex-col gap-1 px-3 py-2 bg-secondary/30 rounded-lg border border-border/50 min-w-[120px]"
          >
            <span className="text-sm font-bold text-muted-foreground">Floor {floor}</span>
            <div className="items-end">
              <p className="text-xs font-medium text-primary">Rooms : {data.totalRooms}</p>
              <span className="text-[11px] font-semibold text-primary">
                Avb : <span className={data.availableSeats > 0 ? "text-green-600" : "text-red-500"}>{data.availableSeats}</span>
                <span className="text-muted-foreground/50 mx-0.5">/</span>
                {data.totalSeats} Seats
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}