"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; 
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getMonth = (month:any) =>{
  let d = new Date().setMonth(month)
  let newDate = new Date(d).toLocaleString("en-US",{
    month:"long"
  })
  return newDate

  
}

export default function AddExpenseReport() {
  const [month, setMonth] = useState(new Date().getMonth()||"");
  const [year, setYear] = useState(new Date().getFullYear()||"");
  const [title,setTitle] = useState(getMonth(month)+", "+year+" expense report")
  const [description,setDescription] = useState("")
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async()=>{
    try {
      setLoading(true)

      let res = await fetch("/api/admin/expenses",{
        method:"POST",
        body:JSON.stringify({
          month,
          year,
          description,
          title
        })
      })

      if(res.ok){
        let {id} = await res.json()
        toast.success("Expenses created success")
        router.push(`/admin/expenses/${id}`)
      }
      
    } catch (error) {
      toast.error("Error occured! please try again")
    }finally{
      setLoading(false)
    }
  }

  return (
    <form onSubmit={(e)=>{
      e.preventDefault()
      handleSubmit()
    }}  className="grid gap-4 mt-4">
         <div className="grid gap-2">
          <Label>Title</Label>
          <Input
            placeholder="November, 2025 expenses"
            value={title}  
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
           <div className="grid gap-2">
          <Label>Description</Label>
          <Input
            placeholder="Describe a bit your costs for the month"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      <div className="grid gap-2 grid-cols-2">
        {/* Month */}
        <div className="grid gap-2">
          <Label>Month</Label>
          <Input
            placeholder="Enter month"
            value={month}
            type="number"
            max={12}
            min={1}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </div>

        {/* Year */}
        <div className="grid gap-2">
          <Label>Year</Label>
          <Input
            placeholder="Enter year"
            value={year}
            min={1970}
            type="number"
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      </div>
 
    {
      loading?
      <Button type="button" variant={"outline"}>Submitting...</Button>
      :
      <Button className="mt-4" type="submit">Submit Report</Button>

    }
    </form>
  );
}
