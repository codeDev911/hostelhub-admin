"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function MealPlanModal({meals}:any) {
  let me = meals.map((meal:any)=>JSON.parse(meal))
  
  
  
  
  const [mealPlan, setMealPlan] : any = useState([]);


useEffect(()=>{
  
  if(meals && me){
    setMealPlan( 
      days.map((day:any,index:any)=>({
        day,
        meals:me[index].meals.map((m:any)=>{
          return {dishes:m?.dishes?.join(",")||""}
        })
      })
    ))
  }else{
     days.map((day) => ({
      day,
      meals: [
        { dishes: "" }, // Breakfast
        { dishes: "" }, // Lunch
        { dishes: "" }, // Dinner
      ],
    }))
  }
},[meals])

  const [loading,setLoading] = useState(false)

  const handleChange = (dayIndex: number, mealIndex: number, value: string) => {
    const updated = [...mealPlan];
    updated[dayIndex].meals[mealIndex].dishes = value;
    setMealPlan(updated);
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();

    const formatted = mealPlan.map((d:any) => (JSON.stringify({
      day: d.day,
      meals: d.meals.map((m:any) => ({
        dishes: m.dishes.split(",").map((x:any) => x.trim()),
      })),
    })));

    try {
        setLoading(true)
        let res = await fetch("/api/admin/hostel",{
            method:"PUT",
            body:JSON.stringify({mealPlan:formatted})
        })
        if(res.ok){
            toast.success("Meal plan updated success!")
        }else{
            toast.error("Error occured! please try again")
        }
    } catch (error) {
        toast.error("An error occured!")
    }finally{
        setLoading(false)

    }

    // send to backend...
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button className="w-full">Show mealplan</Button>
        </DialogTrigger>
        <DialogContent className="h-full  overflow-auto">
            <DialogHeader>
                <DialogTitle>Add you 7 days meal plan</DialogTitle>
                <DialogDescription>Here you can add you meals plan of the week. If you didn't have please ignore</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 h-full overflow-auto">

      <div className="grid gap-6">
        {mealPlan.map((day:any, i:any) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">{day.day}</h3>

            <div className="grid sm:grid-cols-3 gap-3">
              {/* Breakfast */}
              <div>
                <Label>Breakfast</Label>
                <Input
                  placeholder="Eggs, Bread, Tea"
                  value={day.meals[0].dishes}
                  onChange={(e) => handleChange(i, 0, e.target.value)}
                />
              </div>

              {/* Lunch */}
              <div>
                <Label>Lunch</Label>
                <Input
                  placeholder="Rice, Chicken"
                  value={day.meals[1].dishes}
                  onChange={(e) => handleChange(i, 1, e.target.value)}
                />
              </div>

              {/* Dinner */}
              <div>
                <Label>Dinner</Label>
                <Input
                  placeholder="Roti, Sabzi"
                  value={day.meals[2].dishes}
                  onChange={(e) => handleChange(i, 2, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

        {
            !loading ?
            <Button type="submit" className="w-full">
                Save Meal Plan
            </Button>
            :
            <Button type="button"variant={"outline"} className="w-full">
                Saving...
            </Button>
        }
    </form>
        </DialogContent>
    </Dialog>
  );
}
