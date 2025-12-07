"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Save,
  Trash,
  Plus,
  XIcon,
  Trash2,
  PenSquareIcon,
  SheetIcon,
  PrinterIcon,
  Loader2,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExpenseReportPDFExportHTML } from "@/components/ExpenseReportPDFExport";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface Expense {
  title: string;
  category: string;
  amount: number;
}

interface ExpensePieChartProps {
  items: Expense[];
}

const COLORS = [
  "#4ade80", // green
  "#60a5fa", // blue
  "#facc15", // yellow
  "#f87171", // red
  "#a78bfa", // purple
  "#f472b6", // pink
  "#fbbf24", // amber
  "#34d399", // teal
  "#fb923c", // orange
  "#e879f9", // violet
];

const categories = [
  "Food",
  "Transport",
  "Electronics",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Shopping",
  "Insurance",
  "Rent",
  "Miscellaneous",
  "Other",
];

export function ExpensePieChart({ items }: ExpensePieChartProps) {
  const data = Object?.entries(
    items?.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip  />
          <Legend  />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ExpensePage() {
  const [items, setItems]: any = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({} as any);
  const params = useParams();

    const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: 0,
    year: 0,
    
  });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/expenses/${Number(params.id)}`);
        if (res.ok) {
          let d = await res.json();
          const { items, ...dd } = d;
          setData(dd);
          const items_ =
            d?.items?.length > 0
              ? d.items.map((it: any) => JSON.parse(it))
              : [];
          setItems(items_);
          setFormData({
            title:dd?.title||"",
            description:dd?.description||"",
            month:dd?.month || 0,
          year:dd?.year || 0          })
        } else {
          toast.error("Unknown error occured! please try again");
        }
      } catch (error) {
        console.log(error);

        toast.error("Unknown error occured");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [isAddNewItemActive, setIsAddNewItemActive] = useState(false);

  const [loadingAddItem, setLoadingAddItem] = useState(false);
  const [loadingEditItem, setLoadingEditItem] = useState(false);
  const [loadingDeleteItem, setLoadingDeleteItem] = useState(false);

  const [loadingDeleteReport, setLoadingDeleteReport] = useState(false);
  const [loadingEditReport, setLoadingEditReport] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editingItem, setEditingItem] = useState({
    title: "",
    category: "",
    amount: "",
    description: "",
    receiptUrl: "",
  });
  const router = useRouter()

  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newItem, setNewItem] = useState({
    title: "",
    category: "",
    amount: 0,
    description: "",
    receiptUrl: "",
  });

  const filteredItems = useMemo(() => {
    return filterCategory
      ? items.filter((i: any) => i.category === filterCategory)
      : items;
  }, [items, filterCategory]);

  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);
  const paginatedItems: any =
    filteredItems.length > 0 &&
    filteredItems?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const startEdit = (index: any) => {
    setEditing(index);
    setEditingItem(paginatedItems[index]);
  };

  const saveEdit = async (index: any) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;
    const updated: any = [...items];
    updated[globalIndex] = editingItem;

    let json_items: any = updated.map((it: any) => JSON.stringify(it));

    try {
      setLoadingEditItem(true);
      let res = await fetch(`/api/admin/expenses/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({
          items: json_items,
        }),
      });
      if (res.ok) {
        setItems(updated);
        setEditing(null);
        toast.success("Item modified successfully!", {
          icon: <PenSquareIcon className="w-4" />,
        });
      } else {
        toast.error("Unknown error occured!");
      }
    } catch (e) {
      toast.error("Server error");
    } finally {
      setLoadingEditItem(false);
    }
  };

  const deleteReport = async () => {
    const con = confirm("Are you want to delete this report?");
    if (!con) return;

    try {
      setLoadingDeleteReport(true);
      let res = await fetch(`/api/admin/expenses/${data.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("report deleted success");
        router.push("/admin/expenses");
      }
    } catch (error) {
      toast.error("Error occured! Please try again");
    } finally {
      setLoadingDeleteReport(false);
    }
  };

  const editReport = async () => {
    try {
      setLoadingEditReport(true);
      let res = await fetch(`/api/admin/expenses/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setData({ ...data, title:formData.title,description:formData.description,month:formData.month,year:formData.year });
        toast.success("Report edited success");
      }

    } catch (error) {
      toast.error("Error occured! Please try again");
    } finally {
      setLoadingEditReport(false);
    }
  };

  const deleteItem = async (index: any) => {
    const globalIndex = (currentPage - 1) * itemsPerPage + index;

    try {
      setLoadingDeleteItem(true);
      const prevItems = items.filter((_: any, i: any) => i !== globalIndex);

      let res = await fetch(`/api/admin/expenses/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({
          items: prevItems.map((it: any) => JSON.stringify(it)),
        }),
      });

      if (res.ok) {
        setItems(prevItems);
        toast.success("Item deleted success!", {
          icon: <Trash2 className="w-4" />,
        });
      } else {
        toast.error("Unknown error occured!");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoadingDeleteItem(false);
    }
  };

  const addNewItem = async () => {
    if (!newItem.title || !newItem.amount || !newItem.category) return;
    let json_items: any =
      items.length > 0 ? items.map((it: any) => JSON.stringify(it)) : [];
    json_items.push(JSON.stringify(newItem));
    try {
      setLoadingAddItem(true);
      let res = await fetch(`/api/admin/expenses/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({
          items:
            json_items.length !== 0 ? json_items : [JSON.stringify(newItem)],
        }),
      });
      if (res.ok) {
        setItems([...items, newItem]);
        setNewItem({
          title: "",
          category: "",
          amount: 0,
          description: "",
          receiptUrl: "",
        });
        toast.success("New item added success!");
      } else {
        toast.error("Unknown error occured!");
      }
    } catch (error) {
      console.log(error);

      toast.error("Error occured while adding an Item");
    } finally {
      setLoadingAddItem(false);
    }
  };

  // Stats
  const total = items?.reduce(
    (sum: any, item: any) => sum + Number(item.amount),
    0
  );

  const exportToCSV = async () => {
    const docContent =
      "Title,Category,Amount (Rs)\n" +
      items.map((i: any) => `${i.title},${i.category},${i.amount}`).join("\n");
    const blob = new Blob([docContent], { type: "application/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "November 2025 Expense report.csv";

    document.body.appendChild(link);
    link.click();

    // Clean up: remove the link and revoke the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const print = () => {
    if (typeof window !== "undefined") {
      const printWindow = window.open("", "", "width=1000,height=800");

      if (printWindow) {
        printWindow.document.write(` 
        ${ExpenseReportPDFExportHTML(items, data)}
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

        // Optional: auto-close after printing
        setTimeout(() => {
          printWindow.close();
        }, 500);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className=" space-y-8">
      <Link href="/admin/expenses" className="flex items-center gap-2 text-accent hover:text-accent/80">
              <ArrowLeft className="w-4 h-4" />
              Back to Expenses
            </Link>
      <div className="flex max-md:flex-wrap space-y-3 items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Expense details
          </h1>
          <p className="text-foreground/60 text-2xl font-bold">{data?.title}</p>
          <p className="text-foreground/60 ">{data?.description}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon-sm"} title="Actions" className="cursor-pointer">
              <MoreVertical className="w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actions</DialogTitle>
              <DialogDescription>
                Do actions about this report
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 space-x-2 items-center">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-accent text-primary cursor-pointer font-semibold px-6 py-3 rounded-lg hover:bg-accent/70 transition-colors"
              >
                <SheetIcon className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={print}
                className="flex items-center gap-2 bg-green-500 text-primary cursor-pointer font-semibold px-6 py-3 rounded-lg hover:bg-green-500/70 transition-colors"
              >
                <PrinterIcon className="w-5 h-5" />
                Print report
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-2 border-2 border-indigo-500 text-indigo-500 cursor-pointer font-semibold px-6 py-3 rounded-lg hover:bg-intext-indigo-500/10 transition-colors"
                  >
                    <PenSquareIcon className="w-5 h-5" />
                    Edit report
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit expense report details</DialogTitle>
                    <DialogDescription>You can edit these details of the expense report</DialogDescription>
                  </DialogHeader>
                  <div>
                    <form onSubmit={(e)=>{
                      e.preventDefault()
                      editReport()
                    }} className="space-y-3">
                      <div className="flex-col space-y-1">
                        <Label htmlFor="title" className="text-sm font-semibold">Title</Label>
                        <Input  value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})} placeholder="Enter title of your expense report" />
                      </div>
                      <div className="flex-col space-y-1">
                        <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                        <Input  value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} placeholder="Descrip this report a Bit" />
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex-col space-y-1">
                        <Label htmlFor="month" className="text-sm font-semibold">Month</Label>
                        <Input max={12} min={1} type="number" value={formData.month} onChange={(e)=>setFormData({...formData,month:Number(e.target.value)})} placeholder="Enter expense month" />
                      </div>
                      <div className="flex-col space-y-1">
                        <Label htmlFor="year" className="text-sm font-semibold">Year</Label>
                        <Input min={1970} type="number" value={formData.year} onChange={(e)=>setFormData({...formData,year:Number(e.target.value)})} placeholder="Enter expense year" />
                      </div>
                    </div>
                    {loadingEditReport?<Button type="button" variant={"outline"} className="flex-1 flex w-full cursor-pointer" >Saving...</Button>:<Button type="submit" className="flex-1 flex w-full cursor-pointer" >Save</Button>}
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
            {loadingDeleteReport ? (
              <button className="flex items-center gap-2 border-2 border-destructive text-destructive cursor-pointer font-semibold px-6 py-3 rounded-lg h transition-colors">
                <Spinner className="w-5 h-5 animate-spin" />
                Deleting...
              </button>
            ) : (
              <button
                onClick={deleteReport}
                className="flex items-center gap-2 border-2 border-destructive text-destructive cursor-pointer font-semibold px-6 py-3 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                <Trash className="w-5 h-5" />
                Delete report
              </button>
            )}
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6  ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground/60 text-sm font-medium">
                Total expenses
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                Rs {total}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-foreground/60 text-sm font-medium">
              Total items
            </p>
            <p className="text-3xl font-bold  mt-2">{items?.length}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6  ">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <p className="text-foreground/60 text-sm font-medium">
                Expenses by categories
              </p>
              <ExpensePieChart items={items} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Label>Filter by Category:</Label>
        <select
          className="border rounded p-1"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isAddNewItemActive && (
        <Card>
          <CardContent className=" space-y-4">
            <h2 className="text-xl font-semibold">Add New Item</h2>

            <div className="grid md:grid-cols-5 gap-4">
              <Input
                placeholder="Title"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem({ ...newItem, title: e.target.value })
                }
              />
              <Select
                onValueChange={(value: any) =>
                  setNewItem({ ...newItem, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {categories?.map((item: any, ind: any) => (
                    <SelectItem value={item} key={ind}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={newItem.amount}
                onChange={(e) =>
                  setNewItem({ ...newItem, amount: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
              <Input
                placeholder="Receipt URL"
                value={newItem.receiptUrl}
                onChange={(e) =>
                  setNewItem({ ...newItem, receiptUrl: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              {loadingAddItem ? (
                <Button className="flex gap-2 items-center">
                  <Spinner className="w-4 animate-spin h-4" /> Adding item...
                </Button>
              ) : (
                <Button
                  onClick={addNewItem}
                  className="flex gap-2 items-center"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              )}
              <Button
                variant={"outline"}
                onClick={() => setIsAddNewItemActive(false)}
                className="flex gap-2 items-center"
              >
                <XIcon className="w-4 h-4" /> Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">Expense Items</h2>
            {loadingAddItem ? (
              <Button
                variant={"outline"}
                className="flex items-center gap-2 bg-black text-white cursor-pointer font-semibold px-6 py-3 rounded-lg hover:bg-black/70 transition-colors"
              >
                <Spinner className="w-5 h-5 animate-spin" />
                Adding...
              </Button>
            ) : (
              <Button
                variant={"default"}
                onClick={() => setIsAddNewItemActive(true)}
                className="flex "
              >
                <Plus className="w-4 h-4 cursor-pointer" />
                Add item
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedItems &&
                paginatedItems?.map((item: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editing === index ? (
                        <Input
                          value={editingItem.title}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.title
                      )}
                    </TableCell>
                    <TableCell>
                      {editing === index ? (
                        <Input
                          value={editingItem.category}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              category: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.category
                      )}
                    </TableCell>
                    <TableCell>
                      {editing === index ? (
                        <Input
                          type="number"
                          value={editingItem.amount}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              amount: e.target.value,
                            })
                          }
                        />
                      ) : (
                        `Rs ${item.amount}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editing === index ? (
                        <Input
                          value={editingItem.description}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        `${item.description}`
                      )}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      {editing === index ? (
                        <>
                          {loadingEditItem ? (
                            <Button size="icon">
                              <Spinner className="w-4 h-4 animate-spin" />
                            </Button>
                          ) : (
                            <Button size="icon" onClick={() => saveEdit(index)}>
                              <Save className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => startEdit(index)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {loadingDeleteItem ? (
                        <Button size="icon" variant="destructive">
                          <Spinner className="w-4 h-4 animate-spin" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => deleteItem(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="px-2 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
