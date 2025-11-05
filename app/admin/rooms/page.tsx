"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Loader2, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AddMultiplyRoomModal from "@/components/AddMultiplyRoomModal";
import { getRoomCapacity } from "@/lib/room-capicity";

interface Room {
  id: number;
  roomNumber: string;
  floor: string;
  roomType: string;
  totalSeats: number; 
  pricePerMonth: number;
}

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    roomType: "",
    totalSeats: "", 
    pricePerMonth: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/admin/rooms`);
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("[v0] Failed to fetch rooms:", error);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = () => {
    setIsAddingRoom(true);
    setFormData({
      roomNumber: "",
      floor: "",
      roomType: "",
      totalSeats: "", 
      pricePerMonth: "",
    });
  };

  const handleSaveRoom = async () => {
    try {
      const roomData = {
        ...formData,
        totalSeats: Number.parseInt(formData.totalSeats), 
        pricePerMonth: Number.parseFloat(formData.pricePerMonth),
      };

      if (editingId) {
        const response = await fetch("/api/admin/rooms", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...roomData }),
        });

        if (response.ok) {
          const updatedRoom = await response.json();
          setRooms(
            rooms && rooms?.map((r) => (r.id === editingId ? updatedRoom : r))
          );
          toast.success("Room updated successfully");
          setEditingId(null);
        }
      } else {
        const response = await fetch("/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });

        if (response.ok) {
          const newRoom = await response.json();
          setRooms([...rooms, newRoom]);
          toast.success("Room created successfully");
          setIsAddingRoom(false);
        }
      }
      setFormData({
        roomNumber: "",
        floor: "",
        roomType: "",
        totalSeats: "", 
        pricePerMonth: "",
      });
    } catch (error) {
      console.error("[v0] Save room error:", error);
      toast.error("Failed to save room");
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingId(room.id);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor.toString(),
      roomType: room.roomType,
      totalSeats: room.totalSeats.toString(), 
      pricePerMonth: room.pricePerMonth.toString(),
    });
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRooms(rooms.filter((r) => r.id !== id));
        toast.success("Room deleted successfully");
      }
    } catch (error) {
      console.error("[v0] Delete room error:", error);
      toast.error("Failed to delete room");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Room Management</h1>
        <div className="flex space-x-3">
          <Button
          onClick={handleAddRoom}
          className="bg-accent hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
        <AddMultiplyRoomModal/>
        </div>
      </div>

      {/* Add/Edit Room Form */}
      {(isAddingRoom || editingId) && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">
            {editingId ? "Edit Room" : "Add New Room"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Room Number
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., 43"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Room Type
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="">Select Type</option>
                <option value="Single">Single</option>
                <option value="2-Seater">2-Seater</option>
                <option value="3-Seater">3-Seater</option>
                <option value="4-Seater">4-Seater</option>
                <option value="6-Seater">6-Seater</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Total Seats
              </label>
              <input
                type="number"
                name=""
                disabled
                value={getRoomCapacity(formData.roomType)}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
             
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Price (Monthly)
              </label>
              <input
                type="number"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                placeholder="e.g., 8000"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveRoom}
              className="bg-accent hover:bg-accent/90"
            >
              Save Room
            </Button>
            <Button
              onClick={() => {
                setIsAddingRoom(false);
                setEditingId(null);
              }}
              className="bg-muted hover:bg-muted/80 text-foreground"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms &&
          rooms?.map((room: any) => (
            <Card key={room.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                <h3 className="font-bold text-primary">
                    Room {room.roomNumber}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Floor {room.floor}
                </p>
                </div>
                <div className="flex gap-1">
                   <button
                    className="p-2 hover:bg-secondary rounded-lg text-primary"
                  >
                    <Link
                      href={`/admin/rooms/${room.id}`}
                      className="space-y-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </button>
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="p-2 hover:bg-secondary rounded-lg text-primary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                 
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-primary">
                    {room.roomType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium text-primary">
                    {room.totalSeats} seats
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span
                    className={`font-medium ${
                      room.totalSeats - (room?.students?.length || 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {room?.totalSeats - (room?.students?.length || 0)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-accent">
                    Rs {room.pricePerMonth}
                  </span>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
