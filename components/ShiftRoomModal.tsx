import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckIcon, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { toast } from "@/hooks/use-toast";

interface ShiftRoomModalTypes {
  buttonTitle: string;
  student_id: string;
  currentRoom:any
  varient:any|"default"|undefined
}

export default function ShiftRoomModal({
  buttonTitle,
  student_id,varient,
  currentRoom
}: ShiftRoomModalTypes) {
  const [rooms, setRooms] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [selectedRoom,setSelectedRoom] = useState("")
  const [loadingSubmittion,setLoadingSubmittion] = useState(false)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let res= await fetch(`/api/admin/rooms?roomShifting=true&stdId=${student_id}`)
        let data = await res.json()
        setRooms(data)
        
      } catch (error) {
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async () =>{
    try {
      setLoadingSubmittion(true)
      let res = await fetch(`/api/admin/rooms/shift-to?toRoomId=${selectedRoom}`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
           body:JSON.stringify({
          studentId: student_id,
        })
        }
      )
      if (res.ok){
        toast({title:"success"})
      }
    } catch (error) {
      console.log(error);
      
    }
    finally{
      setLoadingSubmittion(false)
    }
  }

  return (
    <Dialog>
       
        <DialogTrigger asChild>
          <Button 
            className="w-full text-start hover:bg-accent/80 text-accent-foreground   bg-accent   transition-colors"
          >{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shift to new Room</DialogTitle>
            <DialogDescription>
              This action will move the student to a new room.
              <br />
              <span className="text-sm">The perosn will shift from : <strong className="text-accent"># {currentRoom.roomNumber} F{currentRoom.floor}, {currentRoom.roomType}</strong></span>
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center justify-center ">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
            <p className="text-base font-semibold">{rooms.length || 0} room(s) availabe</p>
              {rooms && rooms.length >0 ? 
              <div className="lg:grid-cols-5 md:grid-cols-4 grid-cols-2 grid gap-5">
                {rooms.map((room:any,indx:React.Key)=><div key={indx}>
                  <label htmlFor={`room-${room.id}`} className="">
                   <div className={` ${selectedRoom == room.id ? "border-accent" : "border-border"}   group hover:border-accent border-2 focus:ring-accent focus:ring-2 rounded-md p-2.5`}>
                     <div className="flex space-x-1 items-center">
                      <p className={`${selectedRoom == room.id ? "text-accent" :""} text-base font-medium group-hover:text-accent`}>#{room.roomNumber}</p>
                      <p className="text-sm text-nowrap"> {room.roomType}</p>
                    </div>
                    <p className="text-sm ">Avb seats: {room?.totalSeats-room?.students?.length}</p>
                    <div className="flex  items-center justify-between">
                      <p className="text-sm  ">Floor {room.floor}</p>
                      <div className={` accent-accent ${selectedRoom == room.id ? "flex":"hidden"}  hover:flex  items-center bg-accent text-secondary flex justify-center w-5 h-5 border-border border rounded-md`}>
                        <CheckIcon className="w-4"/>
                      </div>
                    </div>
                    <input type="radio" onChange={(e)=>{
                      setSelectedRoom(e.currentTarget.value)
                    }} value={room.id} name="room" className="hidden" id={`room-${room.id}`}/>
                   </div>
                  </label>
                </div>)}
              </div>:"No room availbe to shift"}
            </>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {
              loadingSubmittion ?
              <Button type="button" variant={"ghost"}>Saving changes</Button>
              :
              <Button onClick={handleSubmit}  className="cursor-pointer">Save changes</Button>
            }
          </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
