import React, { useState } from "react";
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
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Label } from "./ui/label";
type ChildProps = {
  onSend: (value: string) => void;
};
const SearchStudentModal = ({ onSend }: ChildProps) => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({} as any);
    const [searchText,setSearchText] = useState("");
   const [open, setOpen] = useState(false)

    const sendData = () =>{
        onSend(student)
        setOpen(false)
    }

  const handleFormSubmit = async() =>{
    try {
        setLoading(true)
        let res = await fetch(`/api/admin/students?searchForHostel=${searchText}`)
        let stu = await res.json()
        setStudent(stu)
        

    } catch (error) {
        console.log(error);
        
    }
    finally{
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Search Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search student </DialogTitle>
          <DialogDescription>
            You can search student via email, id, and phone
          </DialogDescription>
          <Alert variant="default" className="border-accent">
            <AlertCircleIcon className="text-accent" />
            <AlertTitle className="text-accent">Caution.</AlertTitle>
            <AlertDescription>
              Only students who's are not admitted at any hostel/appartment will
              show up here.
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <form onSubmit={(e)=>{
            e.preventDefault();
            handleFormSubmit()
        }} className="grid lg:grid-cols-3 gap-4 grid-cols-1">
          <input
            type="text"
            name="search"
            onChange={(e)=>setSearchText(e.target.value)}
            required
            value={searchText}
            className="w-full lg:col-span-2 col-span-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Search by id, email or phone"
          />
          {loading ?
          <Button type="button" variant={"secondary"}>Searching...</Button>
          : 
          <Button type="submit" variant={"default"}>Search</Button>
          }
        </form>

        <div className="mt-3">
          <h3 className="text-base font-medium">Search result</h3>
         {student && student.id?
         <>
         <h4 className="text-sm my-2 font-medium">Woah! A student you search is founded!</h4>
          <div className="grid  p-3 border-2 border-border rounded-lg md:grid-cols-3 gap-4">
            <div className="flex-col space-y-1">
                <Label>Full Name</Label>
                <p className="text-sm text-foreground">{student.firstName} {student.lastName}</p>
            </div>
            <div className="flex-col space-y-1">
                <Label>Phone</Label>
                <p className="text-sm text-foreground">{student.phone} </p>
            </div>
            <div>
                <Button onClick={sendData} variant={"outline"}>Admit</Button>
            </div>
          </div>
         </>
         
          :
          <div className="space-y-1  mt-4 p-4 rounded-lg border border-border">
            <h4 className="text-sm  font-medium ">Opps! No student found of information you provided!</h4>
            <h4 className="text-sm  font-medium  ">What it mean.</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li className="">Either the student is not valid.</li>
                <li>{"or the hostel owner hasn't droped the student."}</li>
            </ul>
            </div>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchStudentModal;
