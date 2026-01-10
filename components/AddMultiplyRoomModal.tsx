import { InfoIcon, PlusSquareIcon, SparklesIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Form } from './ui/form'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Spinner } from './ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const AddMultiplyRoomModal = ({numberOfRooms}:any) => {
    const router= useRouter()
    const [formData,setFormData]= useState({
        floor:"",
        numberOfrooms:0,
        pricePerMonth:0,
        roomType :"",
        startingNumber:numberOfRooms
    })
    const [loading,setLoading] = useState(false)
    const [isOpen,setIsOpen] = useState(true)

    const handleRoomCreations = async () =>{
        try {
            setLoading(true)
            const res= await fetch("/api/admin/rooms/add-multiple",{
                method:"POST",
                body:JSON.stringify(formData)
            })
            if (res.ok){
                console.log("room created success");
            }
            openChanged()
            setIsOpen(false)
            location.assign("/admin/rooms")
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    const handleChange = (
       e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
     ) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
     };
    

     const openChanged = () =>{
        setFormData({
            floor:"",
            numberOfrooms:0,
            pricePerMonth:0,
            roomType:"",
            startingNumber:numberOfRooms,
        })
     }

  return (
    <Dialog onOpenChange={openChanged}>
        <DialogTrigger><div
          className="bg-primary  text-background flex items-center rounded-md  p-1.5 px-2 hover:bg-primary/90"
        >
          <PlusSquareIcon className="w-4 h-4 mr-2" />
          Add multiple rooms
        </div></DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Add multiple rooms </DialogTitle>
            <DialogDescription>You can add multiple rooms at once</DialogDescription>
        </DialogHeader>
        <Alert variant={"default"} className='bg-secondary border-0'>
            <AlertTitle className='flex space-x-2  items-center text-primary test-sm'>
                <SparklesIcon className='w-4 h-4'/>
                <h2 className="font-bold">Smarter</h2>
            </AlertTitle>
            <AlertDescription>
                <p className='text-primary text-sm'>
                    This Action will create <strong>{formData.numberOfrooms || "x"} room(s) </strong>   of  <strong>  {formData.roomType || "x"} </strong>  in <strong> Floor {formData.floor || "x"} </strong>  with the price of <strong>  Rs.{formData.pricePerMonth | 0} </strong> / month.
                </p>
            </AlertDescription>
        </Alert>
            <form onSubmit={(e)=>{
                e.preventDefault();
                handleRoomCreations()
            }} className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col space-y-1'>
                    <Label htmlFor='floor' className='text-sm font-semibold'>Floor</Label>
                    <Input type='text' required onChange={handleChange} placeholder='Enter floor number (e.g) 4' name='floor'/>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label htmlFor='numberOfRooms' className='text-sm font-semibold'>Number of rooms</Label>
                     <Select required onValueChange={(e)=>setFormData({...formData,numberOfrooms:Number.parseInt(e)})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select number of rooms" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Number of rooms</SelectLabel>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        </SelectGroup>
                      
                    </SelectContent>
                </Select>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label htmlFor='pricePerMonth' className='text-sm font-semibold'>Price/ month</Label>
                    <Input required type="number" min={0}  onChange={handleChange} placeholder='(e.g) 14000' name='pricePerMonth'/>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label htmlFor='roomType' className='text-sm font-semibold'>Room type</Label>
                    <Select required onValueChange={(e)=>setFormData({...formData,roomType:e})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Select room type</SelectLabel>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="2-Seater">2-Seater</SelectItem>
                        <SelectItem value="3-Seater">3-Seater</SelectItem>
                        <SelectItem value="4-Seater">4-Seater</SelectItem>
                        <SelectItem value="6-Seater">6-Seater</SelectItem>
                        </SelectGroup>
                      
                    </SelectContent>
                </Select>
                </div>
                <div className='flex flex-col space-y-1'>
                    <div className="flex items-center space-x-1">
                        <Label htmlFor='startingNumber' className='text-sm font-semibold'>Room starts from</Label>
                    <Tooltip>
                        <TooltipTrigger>
                            <InfoIcon className='w-3'/>
                        </TooltipTrigger>
                        <TooltipContent>It will automatically add the rooms number by one. Enter the last room number. (e.g) {numberOfRooms}</TooltipContent>
                    </Tooltip>
                    </div>
                    <Input required type="number" min={0} value={formData.startingNumber}  onChange={handleChange} placeholder='(e.g) 2' name='startingNumber'/>
                </div>

                <DialogFooter className=''>
                   {!loading? <Button variant={"outline"} className='w-full'>Submit</Button>
                   :
                    <Button variant={"outline"} className='flex w-full text-muted-foreground space-x-1'>
                        <Spinner className='w-4 h-4'/> Submitting...</Button>}
                </DialogFooter>
             
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default AddMultiplyRoomModal