"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LayoutDashboard, Building2, DoorOpen, LogOut, Users, Calendar, Receipt, Newspaper, QrCodeIcon, Check, CopyCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [QrImage,setQrImage] = useState("")
  const [QrLoading,setQrLoding] = useState(false)
  const [formUrl,setFormUrl] = useState("")
  const { logout, loading ,user} = useAuth()
  const [regenerateCodeLoading,setRegenerateLoading] = useState(false)
  const [regenerateModal,setRegenerateModal] = useState(false)
  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
  }

  const fetchFormQRCode = async ()=>{
    try {
      setQrLoding(true)

      const res = await fetch("/api/admin/hostel/qr-form")

      if(res.ok){
        let {qr,url} = await res.json()
        setQrImage(qr)
        setFormUrl(url)
      }else{
        toast.error("Field to load QR code, please try again",{
          action:{
            label:"Try again",
            onClick:()=>fetchFormQRCode()
          }
        })
      }

    } catch (error) {
      toast.error("Field to load QR code, please try again",{
        action:{
          label:"Try again",
          onClick:()=>fetchFormQRCode()
        }
      })
    }finally{
      
      setQrLoding(false)
    }
  }

  const regenerateCode = async() =>{
    try {
      setRegenerateLoading(true)

      let res = await fetch("/api/admin/hostel/qr-form",{
        method:"POST"
      })

      if(res.ok){
        const {qr,url} = await res.json()
        setQrImage(qr)
        setFormUrl(url)
        setRegenerateModal(false)
        toast.success("New Qr-code generated successfully!")
      }else{
        toast.error("An unknown error occured!")

      }

    } catch (error) {
      toast.error("An error occured!")
    }finally{
      setRegenerateLoading(false)
    }
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/hostel", label: "Hostel Details", icon: Building2 },
    { href: "/admin/rooms", label: "Room Management", icon: DoorOpen },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/payments", label: "Payments", icon: Receipt },
    { href: "/admin/feedbacks", label: "Feedbacks", icon: Newspaper },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-primary-foreground/20">
          <h1 className="text-2xl font-bold">HostelHub Admin</h1>
          <p className="text-sm text-primary-foreground/70 mt-1">{user?.email}</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
             return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors text-left`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-border p-4 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold text-primary">Admin Panel</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary rounded-lg">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
              {/* <Dialog>
                <DialogTrigger asChild>
                    <Button onClick={()=>{
                      QrImage == "" ? fetchFormQRCode():""
                    }} className="fixed hover:bg-primary/80 cursor-pointer active:scale-95 transition-all w-10 h-10 bottom-10 rounded-full right-10  z-50">
                    <QrCodeIcon className="w-5"/>
                    </Button>
                </DialogTrigger>
                <DialogContent >
                <DialogHeader>
                  <DialogTitle>Form QR code</DialogTitle>
                  <DialogDescription>Let students to scan this qr code to fill the form to admit in your hostel.</DialogDescription>
                </DialogHeader>
                <div className="w-full h-full justify-center  items-center flex">
                {QrLoading ? 
                  <Spinner className="w-6"/>
                :
                <div className="space-y-4">
                  <img src={QrImage} className="rounded-xl w-full  h-full"/>
                       <Button onClick={()=>{
                      if(formUrl !== ""){
                        navigator.clipboard.writeText(formUrl)
                        toast("Url copied",{
                          icon:<CopyCheck className="w-4"/>
                        })
                      }else{
                        toast.error("no url found! please refresh or regenerate the qr code")
                      }
                    }} className="w-full">Copy url</Button>
                    <Button onClick={()=>{
                      if(QrImage !== ""){
                         const link = document.createElement("a");
                          link.href = QrImage; // data:image/png;base64...
                          link.download = "student-form-qr.png";
                          link.click();
                        toast("Image downloaded",{
                          icon:<CopyCheck className="w-4"/>
                        })
                      }else{
                        toast.error("no url found! please refresh or regenerate the qr code")
                      }
                    }} variant={"outline"} className="w-full">Download image</Button>
               
                      <Dialog open={regenerateModal}>
                      <DialogTrigger asChild>
                        <Button className="w-full" onClick={()=>setRegenerateModal(true)} variant={"outline"} >Regenerate Qr Code</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Regenrate Form QR-code</DialogTitle>
                          <DialogDescription>
                            <Alert variant={"destructive"}>
                              <AlertTitle className="font-bold" >Attention!</AlertTitle>
                              <AlertDescription>
                                Are you sure to re-generate the form qr-code. This will generate a new qr-code and expires the current one. This action Can't be undone.
                              </AlertDescription>
                            </Alert>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose>
                            <Button variant={"outline"} onClick={()=>setRegenerateModal(false)}>No, keep this</Button>
                          </DialogClose>
                          {!regenerateCodeLoading?
                          <Button onClick={regenerateCode}>Yes, Generate new one</Button>
                          :  
                          <Button variant={"outline"} disabled>Generating...</Button>
                        }
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                }
                </div>
                </DialogContent>

              </Dialog> */}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
