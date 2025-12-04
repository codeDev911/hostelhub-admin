"use client"
import AddExpenseReport from "@/components/AddExpenseReport";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, Download, Loader2, MoreVertical, PlusSquareIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const page = () => {
  const [data,setData] = useState([]as any)
  const [loading,setLoading] =useState(true)
  const [stats,setStats] = useState({
    monthlyCostAvg:0,
    yearCost:0,
    prevMonthCost:0
  })
  useEffect(()=>{
    const fetchData = async()=>{
     try {
       const res = await fetch("/api/admin/expenses")
        let d = await res.json()
        setData(d)
        
        let its = d?.map((item:any)=> item.items ||[]).map((it:any)=>it.map((i:any)=>JSON.parse(i))) 
        const items = its.map((it:any)=>{
          return it.reduce((sum:any,item:any)=> sum+Number(item.amount),0)
        })         
        
        const prevMonthDate = new Date(new Date().setMonth(new Date().getMonth()-1))
        setStats({
          monthlyCostAvg: Math.floor(items.reduce((sum:any,item:any)=> sum + Number(item),0) / items.length ),
          yearCost:d?.filter((it:any)=> new Date(it.createdAt).getFullYear() === new Date().getFullYear())?.map((d:any)=> d.items).map((it:any)=>it.map((i:any)=>JSON.parse(i))).map((as:any)=>as.reduce((sum:any,item:any)=> sum + Number(item.amount),0)).reduce((sum:any,item:any)=>sum + Number(item),0)||0,
          prevMonthCost:d?.filter((it:any)=> prevMonthDate.getFullYear() === new Date(it.createdAt).getFullYear() && prevMonthDate.getMonth() == new Date(it.createdAt).getMonth())?.map((d:any)=> d.items).map((it:any)=>it.map((i:any)=>JSON.parse(i))).map((as:any)=>as.reduce((sum:any,item:any)=>sum+Number(item.amount),0)).reduce((sum:any,item:any)=>sum + Number(item),0)||0,
        })

     } catch (error) {
      console.log(error);
      
      toast.error("Error occure! please try again")
     }
     finally{
      setLoading(false)
     }
  
    }
    fetchData();
  },[])

   if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      )
    }
   
  
  return (
    <div className="w-full  bg-background">
      <div className="flex max-md:flex-wrap space-y-2 w-full items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Expenses</h1>
          <p className="text-foreground/60">
            Manage and track your business expenses and costs
          </p>
        </div>
        <div className="flex max-md:flex-wrap space-x-2 items-center">
          {/* <button className="flex items-center hover:cursor-pointer gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent/70 transition-colors">
            <Download className="w-5 h-5" />
            Export Reports
          </button> */}
         <Dialog>
            <DialogTrigger>
                 <button className="flex items-center hover:cursor-pointer gap-2 bg-black text-white font-semibold px-6 py-3 rounded-lg hover:bg-black/70 transition-colors">
            <PlusSquareIcon className="w-5 h-5" />
            Create Report
          </button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create cost report</DialogTitle>
                    <DialogDescription>This will help you track your expenses and costs made by your business monthly</DialogDescription>
                </DialogHeader>
                <div className="">
                <AddExpenseReport />
                </div>
            </DialogContent>
         </Dialog>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Monthly cost (avg)</p>
              <p className="text-3xl font-bold text-green-600 mt-2">Rs {stats.monthlyCostAvg}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Cost this year</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">Rs {stats.yearCost}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">Cost previous month</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">Rs {stats.prevMonthCost}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        </div>
      </div>
       <div className="bg-white mt-5 rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Month / Year</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total cost</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created At</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                   
                       {data?.map((item:any,ind:any)=>(
                         <tr key={ind}  className="hover:bg-secondary/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {item?.title}
                          </td>
                          <td className="px-6 py-4 text-sm  text-foreground">
                            {item.month}, {item.year}
                          </td>
                          <td className="px-6 py-4 text-sm  text-foreground">
                            Rs {item.items.map((t:any)=>JSON.parse(t)).reduce((sum:any, item:any) => sum + Number(item.amount), 0)}
                          </td>
                          <td className="px-6 py-4 text-sm  text-foreground">
                           {new Date(item.createdAt).toLocaleString('en-US',{
                            month:"short",
                            day:"numeric",
                             year:"numeric"
                           })}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant={"outline"}>
                              <MoreVertical className="w-4"/>
                            </Button> 
                              </PopoverTrigger>
                              <PopoverContent className="max-w-[200px]">
                                <Link href={`/admin/expenses/${item.id}`} className="flex  w-full flex-1 text-sm p-2 rounded-md hover:bg-accent/20">View details</Link>
                              </PopoverContent>
                            </Popover>
                          </td>
                        </tr> 
                       ))}
                  </tbody>
                </table>
              </div>
            </div>
    </div>
  );
};

export default page;
