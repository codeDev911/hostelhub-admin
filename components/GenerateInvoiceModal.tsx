"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Sparkles, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface InvoiceDialogType{
    studentId :string,
    studentName:string
    roomPriceMonthly:any
}

export default function InvoiceDialog({studentId,studentName,roomPriceMonthly}:InvoiceDialogType) {
  const [open, setOpen] = useState(false);
  const [loading,setLoading] = useState(false)
  const [form, setForm] = useState({
    studentId: studentId,
    invoiceMonth: new Date().getMonth() ,
    invoiceYear: new Date().getFullYear(),
    amount: roomPriceMonthly,
    dueDate: new Date(),
    notes: "",
    status: "pending",
  });

  const handleUpdate = (key:any, val:any) => setForm((p) => ({ ...p, [key]: val }));

  const submit = async() => {

    if(!form.amount && !form.status && !form.invoiceMonth && !form.invoiceYear) return;

    try {
        setLoading(true)
        let res = await fetch("/api/admin/invoices",{
            method:"POST",
            body:JSON.stringify(form)
        })
        if(res.ok){
            toast("Invoice generate success",{
                icon:<CheckCircle className="w-4"/>
            })
            setOpen(false);
        }else{
            toast("Unknown error occured",{
                icon:<XIcon className="w-4"/>
            })
        }
    } catch (error) {
        toast("Error occured!",{
                icon:<XIcon className="w-4"/>
        })
    }finally{
        setLoading(false)
    }
  };
  function monthName(month:any) {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", { month: "long" });
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Create Invoice</Button>
      </DialogTrigger>

      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <Alert>
        <AlertTitle className="flex items-center space-x-1">
            <Sparkles className="w-4"/>
            <p className="text-sm font-bold">Smarter</p>
        </AlertTitle>
        <AlertDescription>
            <p className="text-sm text-muted-foreground">
                This invoice will be issued to <strong>{studentName} </strong> 
                for the month of <strong>{monthName(form.invoiceMonth)} </strong> 
                of the year <strong>{form.invoiceYear}</strong>, 
                with a total amount of <strong>{form.amount} PKR</strong>. 
                The payment must be completed before <strong>{format(form.dueDate, "PPP")}</strong>. 
            </p>
        </AlertDescription>
      </Alert>
        </DialogHeader>

        <div className="grid gap-4">
      

         

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Month</Label>
              <Input
                type="number"
                placeholder="1 - 12"
                value={form.invoiceMonth || ""}
                onChange={(e) => handleUpdate("invoiceMonth", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                type="number"
                placeholder="2025"
                value={form.invoiceYear}
                onChange={(e) => handleUpdate("invoiceYear", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount (PKR)</Label>
            <Input
              type="number"
              placeholder="5000"
              value={form.amount}
              onChange={(e) => handleUpdate("amount", Number(e.target.value))}
            />
          </div>

          {/* Due Date */}
          <div className="grid gap-1 space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.dueDate ? format(form.dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.dueDate}
                  onSelect={(v) => handleUpdate("dueDate", v)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => handleUpdate("status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pending" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          {/* <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              placeholder="Optional notes..."
              onChange={(e) => handleUpdate("notes", e.target.value)}
              value={form.notes}
            />
          </div> */}
        </div>

        <DialogFooter>
          <Button variant={"outline"} onClick={()=>{
            setOpen(false)
            setForm({
                amount:0,
                dueDate:new Date(),
                invoiceMonth:new Date().getMonth(),
                invoiceYear:new Date().getFullYear(),notes:"",status:"pending",studentId
            })
          }}>Cancel</Button>
          {loading?<Button variant={"outline"} >Submitting...</Button>:<Button onClick={submit}>Submit Invoice</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
