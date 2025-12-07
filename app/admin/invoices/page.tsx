"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircleIcon, CheckIcon, Clock10Icon, Clock12Icon, InfoIcon, Loader2, Receipt, Redo2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesGenerationLoading, setInvoicesGenerationLoading] =
    useState(false);
  const [form, setForm] = useState({
    invoiceMonth: new Date().getMonth() || "",
    invoiceYear: new Date().getFullYear() || "",
    dueDate: new Date(),
    notes: "",
  });

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    fetch("/api/admin/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      });
  }, []);

  const getBadge = (status: string) => {
    if (status === "paid")
      return <Badge className="bg-green-600">{status}</Badge>;
    if (status === "overdue")
      return <Badge className="bg-red-600">{status}</Badge>;
    return <Badge className="bg-yellow-500">{status}</Badge>;
  };

  const paid = invoices?.filter((i) => i.status === "paid").length;
  const pending = invoices?.filter((i) => i.status === "pending").length;
  const overdue = invoices?.filter((i) => i.status === "overdue").length;
  const refunded = invoices?.filter((i) => i.status === "refunded").length;

  const handleGenerateInvoices = async () => {
    try {
      setInvoicesGenerationLoading(true);
      let res = await fetch("/api/admin/invoices/generate-multiple", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast("Invoices generated success");
        location.reload();
      } else {
        toast("Error occured pleaes try again", {
          action: {
            label: "try again",
            onClick: () => handleGenerateInvoices(),
          },
        });
      }
    } catch (error) {
      toast("Error occured pleaes try again", {
        action: {
          label: "try again",
          onClick: () => handleGenerateInvoices(),
        },
      });
    } finally {
      setInvoicesGenerationLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Payments & Invoices
            </h1>
            <p className="text-foreground/60">
              Manage and track student payments with automated monthly invoicing
            </p>
          </div>

          <div className="flex space-x-2 items-center">
           
              <Dialog open={isOpenDialog}>
          <DialogTrigger asChild>
             <button
             onClick={()=>setIsOpenDialog(true)}
              className="flex items-center cursor-pointer gap-2 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Generate invoices
            </button> 
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate invoices</DialogTitle>
              <DialogDescription>
                Generate invoice at the start of month to avoid conflicts and
                technical errors about your payments
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateInvoices();
              }}
            >
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Month</Label>
                  <Input
                    required
                    min={0}
                    type="number"
                    value={form.invoiceMonth}
                    onChange={(e) =>
                      setForm({ ...form, invoiceMonth: e.target.value })
                    }
                    placeholder={`${new Date().getMonth()}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice year</Label>
                  <Input
                    required
                    type="number"
                    value={form.invoiceYear}
                    onChange={(e) =>
                      setForm({ ...form, invoiceYear: e.target.value })
                    }
                    placeholder={`${new Date().getFullYear()}`}
                  />
                </div>
                <div className="">
                  <Label className="flex items-center ">
                    <p>Amount</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        The amount will be selected based on the room monthly
                        fee
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Alert className="p-2 px-3">
                    <AlertDescription>Based on rooms fee</AlertDescription>
                  </Alert>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <input
                    required
                    type="date"
                    onChange={(e) =>
                      setForm({ ...form, dueDate: new Date(e.target.value) })
                    }
                    className="p-2 rounded-md border-border border text-sm w-full"
                  />
                </div>
              </div>

              {/* <div className="space-y-2 mt-4">
                <Label>Notes (optional)</Label>
                <input type="text" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Invoice of the month Octuber " className="p-2 rounded-md border-border border text-sm w-full"/>
              </div> */}
              {invoicesGenerationLoading ? (
                <Button className="mt-2 w-full" variant={"outline"}>
                  Submitting
                </Button>
              ) : (
                <Button className="mt-2 w-full" type="submit">
                  Submit
                </Button>
              )}
            </form>
            <Button variant={"outline"} onClick={() => setIsOpenDialog(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div
              className="p-4 rounded-lg transition-all duration-300  bg-card"
            >
              <div className="flex items-start justify-between ">
                <div className="">
                  <p className="text-sm text-muted-foreground font-medium">
                    Paid
                  </p>
                  <div className={`py-2  `}> 
                    <CheckCircleIcon className={`w-6 h-6  text-green-400  `}/>
                  </div>
                </div>

                <p className="text-3xl font-bold text-primary">{paid}</p>
              </div>
            </div>
        <div
              className="p-4 rounded-lg transition-all duration-300  bg-card"
            >
              <div className="flex items-start justify-between ">
                <div className="">
                  <p className="text-sm text-muted-foreground font-medium">
                    Pending
                  </p>
                  <div className={`p-2 `}> 
                    <Clock10Icon className="w-6 h-6 text-yellow-400"/>
                  </div>
                </div>

                <p className="text-3xl font-bold text-primary">{pending}</p>
              </div>
            </div>
        <div
              className="p-4 rounded-lg transition-all duration-300  bg-card"
            >
              <div className="flex items-start justify-between ">
                <div className="">
                  <p className="text-sm text-muted-foreground font-medium">
                    Overdue
                  </p>
                   <div className={`p-2 `}> 
                    <Clock12Icon className="w-6 h-6 text-red-400"/>
                  </div>
                </div>

                <p className="text-3xl font-bold text-primary">{overdue}</p>
              </div>
            </div>
        <div
              className="p-4 rounded-lg transition-all duration-300  bg-card"
            >
              <div className="flex items-start justify-between ">
                <div className="">
                  <p className="text-sm text-muted-foreground font-medium">
                    Refunded
                  </p>
                  <div className={`p-2 `}> 
                    <Redo2 className="w-6 h-6 text-blue-400"    />         
                    </div>
                </div>

                <p className="text-3xl font-bold text-primary">{refunded}</p>
              </div>
            </div>
      </div>

      {/* Auto-Generation Info */}
      <div className="bg-accent/10 border border-accent rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Receipt className="w-6 h-6 text-accent shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-primary mb-2">
              Automated Invoice Generation
            </h3>
            <p className="text-sm text-foreground">
              Invoices are automatically generated on the 1st of every month for
              all active students based on their room type and booking
              agreement. Overdue invoices are marked after their due date
              passes.
            </p>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-card p-4 rounded-lg">
        <div>
          <h3 className="text-xl font-bold text-primary">Invoice List</h3>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.map((inv) => (
                  <TableRow
                    className="cursor-pointer "
                    onClick={() => location.assign(`/admin/invoices/${inv.id}`)}
                    key={inv.id}
                  >
                    <TableCell className="font-semibold">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {inv.student?.firstName} {inv.student?.lastName}
                    </TableCell>
                    <TableCell>
                      {inv.invoiceMonth}/{inv.invoiceYear}
                    </TableCell>
                    <TableCell>Rs {inv.amount}</TableCell>
                    <TableCell>{getBadge(inv.status)}</TableCell>
                    <TableCell>
                      {new Date(inv.issuedDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
