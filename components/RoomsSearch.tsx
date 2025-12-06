"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sparkles } from "lucide-react";

function filterRooms(rooms:any, filters:any) {
  return rooms.filter((room:any) => {
    const matchNumber = String(room.roomNumber || "")
      .toLowerCase()
      .includes(String(filters.roomNumber || "").toLowerCase());

    const matchType = filters.roomType ? room.roomType === filters.roomType : true;

    const matchFloor = filters.floor ? String(room.floor) === String(filters.floor) : true;

    const requiredSeats = filters.availableSeats ? Number(filters.availableSeats) : 0;
    const availableSeats = (room.totalSeats || 0) - (room?.students?.length || 0);
    const matchSeats = filters.availableSeats ? availableSeats >= requiredSeats : true;

    const priceMin = Array.isArray(filters.priceRange) ? filters.priceRange[0] : 0;
    const priceMax = Array.isArray(filters.priceRange) ? filters.priceRange[1] : Number.POSITIVE_INFINITY;
    const matchPrice = (room.pricePerMonth || 0) >= priceMin && (room.pricePerMonth || 0) <= priceMax;

    return matchNumber && matchType && matchFloor && matchSeats && matchPrice;
  });
}



export default function RoomFilter({ rooms = [], onFilter }:any) {
  const [filters, setFilters] = useState({
    roomNumber: "",
    roomType: "",
    floor: "",
    availableSeats: "",
    priceRange: [0, 50000],
  });

  // derived filteredRooms (kept for local rendering/use) — will update whenever rooms or filters change
  const filteredRooms = useMemo(() => filterRooms(rooms, filters), [rooms, filters]);

  // IMPORTANT: call onFilter whenever filteredRooms updates. This avoids the race-condition
  // where setState is async and calling onFilter right after setFilters would use stale filters.
  useEffect(() => {
    onFilter && onFilter(filteredRooms);
  }, [filteredRooms, onFilter]);

  // update filters safely — type conversions done here where appropriate
  const handleChange = (key:any, value:any) => {
    // normalize numeric string inputs for seats and floor
    let next = value;
    if (key === "availableSeats") {
      // allow empty string to clear filter
      next = value === "" ? "" : Number(value);
    }

    if (key === "floor") next = value; // keep as string (rooms.floor might be string)

    if (key === "priceRange") next = value; // slider already emits array

        setFilters((prev) => ({ ...prev, [key]: next }));
    // DO NOT call onFilter(filteredRooms) here — filteredRooms will be stale because state update is async.
  };

 

const removeFilter = (key:any) => {
  setFilters((prev:any) => ({
    ...prev,
    [key]: key === "priceRange" ? [0, 50000] : ""
  }));
};

const ActiveFilters = ({ filters, removeFilter }:any) => {
  const active = Object.entries(filters).filter(([_, v]) => {
    if (Array.isArray(v)) return v[0] !== 0 || v[1] !== 50000;
    return v !== "";
  });

  if (!active.length) return null;

  return (
    <div className="flex flex-wrap gap-2 my-2 items-center">
        <h2 className="text-sm font-semibold">Filters</h2>
      {active.map(([key, val]:any) => (
        <div
          key={key}
          className="flex items-center gap-1 bg-background text-sm px-3 py-1 rounded-full border"
        >
          <span className="capitalize">
            {key}: {Array.isArray(val) ? `${val[0]} - ${val[1]}` : val}
          </span>
          <button
            onClick={() => removeFilter(key)}
            className="text-red-500 font-bold hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};



  return (
    <Card className="w-full space-y-4 mb-4">
        <CardHeader>
            <CardTitle className="flex items-center space-x-1">
                <Sparkles className="w-4"/>
                <p>Smart search</p>
            </CardTitle>
            <CardDescription>Use our smartest and intelligence search and filters to optimize your rooms across your hostel</CardDescription>
            <ActiveFilters filters={filters} removeFilter={removeFilter} />
        </CardHeader>
      <CardContent className="grid -mt-7 md:grid-cols-6 gap-4">
        {/* Room Number */}
        <div className="space-y-2 ">
          <Label className="">Room Number</Label>
          <Input
            placeholder="Search room number"
            value={filters.roomNumber}
            onChange={(e) => handleChange("roomNumber", e.target.value)}
          />
        </div>

        {/* Room Type */}
        <div className="space-y-2 ">
          <Label className="">Room Type</Label>
          <Select  onValueChange={(v) => handleChange("roomType", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="2-Seater">2 Seater</SelectItem>
              <SelectItem value="3-Seater">3 Seater</SelectItem>
              <SelectItem value="4-Seater">4 Seater</SelectItem>
              <SelectItem value="5-Seater">5 Seater</SelectItem>
              <SelectItem value="6-Seater">6 Seater</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Floor */}
        <div className="space-y-2 ">
          <Label className="">Floor</Label>
          <Input
            placeholder="Enter floor"
            value={filters.floor}
            onChange={(e) => handleChange("floor", e.target.value)}
          />
        </div>

        {/* Available Seats */}
        <div className="space-y-2 ">
          <Label className="">Available Seats (min)</Label>
          <Input
            type="number"
            placeholder="Min seats"
            value={filters.availableSeats}
            onChange={(e) => handleChange("availableSeats", e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2 ">
          <Label className="">Price Range</Label>
          <Slider
            defaultValue={[0, 50000]}
            max={50000}
            step={1000}
            value={filters.priceRange}
            onValueChange={(v) => handleChange("priceRange", v)}
          />
          <div className="text-sm text-muted-foreground">
            {filters.priceRange[0]} PKR - {filters.priceRange[1]} PKR
          </div>
        </div>
 
      </CardContent>
    </Card>
  );
}