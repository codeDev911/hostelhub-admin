"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Loader2, EyeIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AddMultiplyRoomModal from "@/components/AddMultiplyRoomModal";
import { getRoomCapacity } from "@/lib/room-capicity";
import RoomsSearch from "@/components/RoomsSearch";
import { Spinner } from "@/components/ui/spinner";
import RoomStats from "@/components/RoomsStats";

interface Room {
  id: number;
  roomNumber: string;
  floor: string;
  roomType: string;
  totalSeats: number; 
  pricePerMonth: number;
}

export default function RoomManagementPage() {
  const [initialRooms, setInitialRooms] = useState<Room[]>([]);
  const [rooms,setRooms]= useState([]as any)
  const [loading, setLoading] = useState(true);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isSavingRoomsLoading, setSavingRoomsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteRoomLoading,setDeleteRoomLoading] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    roomType: "",
    totalSeats: 0, 
    pricePerMonth: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/admin/rooms`);
        const data = await response.json();
        setInitialRooms(data);
        setRooms(data)
        console.log(data);
        
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
      totalSeats: 0, 
      pricePerMonth: "",
    });
  };

  const handleSaveRoom = async () => {
    try {
      setSavingRoomsLoading(true)
      const roomData = {
        ...formData,
        totalSeats: getRoomCapacity(formData.roomType), 
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
            rooms && rooms?.map((r:any) => (r.id === editingId ? updatedRoom : r))
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
          setFormData({
          roomNumber: "",
          floor: "",
          roomType: "",
          totalSeats: 0, 
          pricePerMonth: "",
        });
          }
          else{
            let res  =  await response?.json()
            
            toast.error(res.error)
          }
      }
      
    } catch (error) {
      toast.error("Failed to save room");
    }
    finally{
      setSavingRoomsLoading(false)
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingId(room.id);
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor.toString(),
      roomType: room.roomType,
      totalSeats: room.totalSeats, 
      pricePerMonth: room.pricePerMonth.toString(),
    });
  };

  const handleDeleteRoom = async (id: number) => {
    
    try {
      setDeleteRoomLoading(true)
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setRooms(rooms.filter((r:any) => r.id !== id));
        toast.success("Room deleted successfully");
      }else{
        toast.error("Error occure, please try again");
      }
    } catch (error) {
      console.error("Delete room error:", error);
      toast.error("Failed to delete room");
    }finally{
      setDeleteRoomLoading(false) 
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
      <div className="flex max-md:flex-wrap space-y-2.5 items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Room Management</h1>
          <p className="text-foreground/60">Manage rooms across your hostel / appartment</p>
        </div>
        <div className="flex space-x-3">
          <Button
          onClick={handleAddRoom}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
        <AddMultiplyRoomModal numberOfRooms={rooms?.length+1||1}/>
        </div>
      </div>

      <RoomStats rooms={rooms} />
<br />
      <RoomsSearch  rooms={initialRooms} onFilter={setRooms}/>

      {/* Add/Edit Room Form */}
      {(isAddingRoom || editingId) && (
        <div className="fixed">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => {setIsAddingRoom(false); setEditingId(null)}}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card p-2 rounded-lg z-50 w-full max-w-md">
          <div className="p-6 mb-8 bg-card rounded-lg">
          <h2 className="text-xl font-bold text-primary mb-4">
            {editingId ? "Edit Room" : "Add New Room"}
          </h2>
          <form onSubmit={(e)=>{
            e.preventDefault()
            handleSaveRoom()
          }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Room Number
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                required
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
                required
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
                required
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
                name="totalSeats"
                disabled
                onChange={handleChange}
                required
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
                required
                placeholder="e.g., 8000"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
          <div className="flex gap-3">
            {
              isSavingRoomsLoading?
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Loader className="w-5 h-5 animate-spin"/>
            </Button>:
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Save Room
            </Button>
            }
            <Button
            type="reset"
              onClick={() => {
                setIsAddingRoom(false);
                setEditingId(null);
              }}
              className="bg-muted hover:bg-muted/80 text-foreground"
            >
              Cancel
            </Button>
          </div>
          </form>
        </div>
          </div>
        </div>
      )}

      {/* Rooms List */}
     <div className="w-full overflow-x-auto bg-card rounded-lg ">
  <table className="w-full text-sm text-left">
    <thead className="border-b  border-border bg-secondary/70 text-muted-foreground">
      <tr>
        <th className="p-4 font-medium">Room#</th>
        <th className="p-4 font-medium">Floor</th>
        <th className="p-4 font-medium">Type</th>
        <th className="p-4 font-medium">Students</th>
        <th className="p-4 font-medium">Available</th>
        <th className="p-4 font-medium">Price</th>
        <th className="p-4 font-medium text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {rooms &&
        rooms?.map((room: any) => (
          <tr 
            key={room.id} 
            className="border-b border-border last:border-0 hover:bg-muted/30 transition-all"
          >
            <td className="px-4 py-2">
              <span className="font-bold text-primary">{room.roomNumber}</span>
            </td>
            <td className="px-4 py-2 text-muted-foreground">
              Floor {room.floor}
            </td>
            <td className="px-4 py-2 font-medium text-primary">
              {room.roomType}
            </td>
            <td className="px-4 py-2 font-medium text-primary">
              {room.students?.length||0}
            </td>
            <td className="px-4 py-2">
              <span
                className={`font-medium ${
                  room.totalSeats - (room?.students?.length || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {room.totalSeats - (room?.students?.length || 0)}
              </span>
            </td>
            <td className="px-4 py-2 font-bold text-accent">
              Rs {room.pricePerMonth}
            </td>
            <td className="px-4 py-2">
              <div className="flex justify-end gap-1">
                <button className="p-2 hover:bg-secondary rounded-lg text-primary">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className="flex items-center justify-center"
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
                {deleteRoomLoading ? (
                  <button className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                    <Spinner className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
    </div>
  );
}
