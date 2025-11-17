"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Edit2, Plus, X, Phone, Mail, Clock, Utensils, Home, AlertCircle, Loader2, Globe2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import UploadImages from "@/components/UploadImages"
import MapPicker from "@/components/MapPicker"
import MealPlanModal from "@/components/MealPlanModal"

export default function HostelDetailsPage() {

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false)

  const [newAmenity, setNewAmenity] = useState("")
  const [newRule, setNewRule] = useState("")
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [editingMeal, setEditingMeal] = useState<{ dayIndex: number; mealIndex: number; dishIndex: number } | null>(
    null,
  )
  const [editingDishValue, setEditingDishValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({} as any)
  const [amenities, setAmenities] = useState([] as any)
  const [rules, setRules] = useState([] as any)
  const [hostel, setHostel] = useState<any>(null)
  const [submitLoading,setSubmitLoading] = useState(false)
   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
   const [savingMapLoading,setSavingMapLoading] = useState(false)
  const [metaDetails,setMetaDetails] = useState({
    title:"",
    description:"",
    canonical:"",
    keywords:""
  })
  useEffect(()=>{
    const fetchHostel = async ()=>{
      try {
        setLoading(true)
        let res= await fetch('/api/admin/hostel')
        let data = await res.json()
        setHostel(data)
        setFormData(data)
        setMetaDetails(data?.metaDetails)
        setAmenities(data.amenities)
        setRules(data.rules)
      } catch (error) { 
        toast("Failed to fetch hostel data")
      }finally{
        setLoading(false)
      }
    }
    fetchHostel()
  },[])


  const handleSubmit = async () => {
    try {
      setSubmitLoading(true)

      // Exclude these data to avoid conflicts and updations
       const {ownerId,id,...data_} = formData
      
      const response = await fetch('/api/admin/hostel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ ...data_, amenities, rules,metaDetails ,pricePerMonth:Number.parseInt(formData.pricePerMonth)}),
      })
      if (!response.ok) {
        toast.error("Error occured!")
      }
      toast.success("Hostel details updated successfully",)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error('Failed to update hostel details')
    } finally {
      setSubmitLoading(false)
    }
  }

  

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  } 

  if (!hostel && !loading && !formData == undefined) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/60">Hostel not found</p>
        </div>
      </>
    )
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev:any) => ({ ...prev, [name]: value }))
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity])
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_:any, i:any) => i !== index))
  }

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule])
      setNewRule("")
    }
  }

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_:any, i:any) => i !== index))
  }

 
  
  const handleSave = () => {
    handleSubmit()
  }



  const handleSetLocation = async()=>{
      try {
        setSavingMapLoading(true)
        setTimeout(() => {
          
        }, 2000);
      } catch (error) {
        toast.error("Error saving map")
      }finally{
        setSavingMapLoading(false)
      }

  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Hostel Details</h1>
          <p className="text-muted-foreground">Manage all information about your hostel</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`rounded-lg px-6 py-3 font-semibold transition-all ${
            isEditing ? "bg-destructive hover:bg-destructive/90" : "bg-accent hover:bg-accent/90"
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-5  ">
        <div className="lg:col-span-2 col-span-1 space-y-5">
          {/* Basic Information Section */}
      <Card className="p-8 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <Home className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Basic Information</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">Hostel Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">Gender Type</label>
              <input
                type="text"
                value={hostel?.gender}
                disabled
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Short Description</label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Full Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">City</label>
              <input
                type="text"
                value={hostel?.city}
                disabled
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">Area</label>
              <input
                type="text"
                name="area"
                value={hostel?.area}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"

              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-3">State</label>
              <input
                type="text"
                value={hostel?.state}
                disabled
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted"
              />
            </div>
          </div>
        </div>
      </Card>

    

      {/* Amenities Section */}
      <Card className="p-8 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <Home className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Amenities</h2>
        </div>
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add new amenity"
              disabled={!isEditing}
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              onClick={handleAddAmenity}
              disabled={!isEditing}
              className="bg-accent hover:bg-accent/90 rounded-lg px-6"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities?.map((amenity:any, idx:any) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-secondary p-4 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{amenity}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-destructive hover:text-destructive/80 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google map</CardTitle>
          <CardDescription>Setup your business location on Google map, This will be shown to public</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <MapPicker onSelect={(coords:any)=>{
            setLocation(coords)
          }}/> */}
          <br />
          <h2 className="text-xl font-bold text-center">Commin soon...</h2>
      {/* {savingMapLoading ?   <Button variant={"outline"} disabled>Saving...</Button> :   <Button onClick={handleSetLocation}>Save map</Button>} */}
        </CardContent>
      </Card>

      {/* House Rules Section */}
      <Card className="p-8 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Rules & Polices</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-lg font-bold text-foreground">Guest policy</p>
             <div className="flex gap-3">
            <input
              type="text"
              name="guestPolicy" 
              value={formData.guestPolicy}
              onChange={handleChange}
              placeholder="(e.g) Guest must be 18+ to stay"
              disabled={!isEditing}
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            /> 
          </div>
          </div>
          <div className="space-y-3">
            <p className="text-lg font-bold text-foreground">Cancellation policy</p>
             <div className="flex gap-3">
            <input
              name="cancellationPolicy"
              type="text"
              value={formData.cancellationPolicy}
              onChange={handleChange}
              placeholder="(e.g) Cancellations must be made 24 hours in advance"
              disabled={!isEditing}
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            /> 
          </div>
          </div>
        </div>
        <div className="space-y-6">
            <p className="text-lg font-bold text-foreground">Rules</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add new rule"
              disabled={!isEditing}
              className="flex-1 px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              onClick={handleAddRule}
              disabled={!isEditing}
              className="bg-accent hover:bg-accent/90 rounded-lg px-6"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {rules?.map((rule:any, idx:any) => (
              <div
                key={idx}
                className="flex items-start justify-between bg-secondary p-4 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm text-foreground">{rule}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveRule(idx)}
                    className="text-destructive hover:text-destructive/80 shrink-0 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

     
      <UploadImages images={hostel.images}/>
        </div>
        <div className="space-y-5">
            {/* Contact Information Section */}
      <Card className="md:p-8 p-4 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Contact Information</h2>
        </div>
          <p className="text-sm">Note: This details will be show to public</p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </Card>

      {/* Check-in/Check-out Times Section */}
      <Card className="p-8 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Check-in & Check-out Times</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Check-in Time</label>
            <input
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Check-out Time</label>
            <input
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </Card>
       {/* Pricing Section */}
      <Card className="p-8 rounded-lg border-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-primary">Pricing</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-3">Price Per Month (Base)</label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-foreground">Rs</span>
              <input
                type="number"
                name="pricePerMonth"
                value={formData.pricePerMonth}
                onChange={handleChange}
                disabled={!isEditing}
                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div> 
        </div>
      </Card>
      
      {/* Meal Plan Section - made meal plan fully editable */}
        <Card className="p-8 rounded-lg border-0 bg-white">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-primary">7-Day Meal Plan</h2>
          </div>
          <div className="w-full flex flex-wrap gap-3">
            <MealPlanModal meals={hostel.mealPlan}/>
          </div>
        
        </Card>

{/* MEta details  */}
           <Card className="p-8 rounded-lg border-0 bg-white">
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-xl font-bold text-primary">Meta Details </h2>
              <p className="text-foreground text-sm">For SEO optimization </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={metaDetails?.title||""}
                onChange={(e:any)=>setMetaDetails({...metaDetails,title:e.target.value})}
                disabled={!isEditing}
                placeholder="Best accomudation in Peshawar"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Meta Description</label>
              <input
                type="text"
                name="metaDescription"
                value={metaDetails?.description||""}
                onChange={(e:any)=>setMetaDetails({...metaDetails,description:e.target.value})}
                disabled={!isEditing}
                placeholder="Our beds smells different for..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Meta keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={metaDetails?.keywords||""}
                onChange={(e:any)=>setMetaDetails({...metaDetails,keywords:e.target.value})}
                disabled={!isEditing}
                placeholder="hostel in peshawar, best hostel, hostel for students"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
         
            <div className="mt-6">
              <h2 className="text-xl font-bold text-primary">SE preview </h2>
              <p className="text-foreground text-sm">How will it looks like in Search Engines </p>
              <div className="bg-white border rounded-lg p-4 shadow-sm mt-3">
                <p id="preview-url" className="text-sm text-green-700 mb-1">
                  {"https://orhan.hostelhub.pk"}
                </p>

                <h3 id="preview-title" className="text-blue-700 cursor-alias text-lg hover:underline">
                  {metaDetails?.title||"Luxury Stay Hotel — Book Rooms in Islamabad"}
                </h3>

                <p id="preview-description" className="text-gray-700 text-sm mt-1">
                  {metaDetails?.description||"Book luxury rooms in Islamabad with Wi-Fi, breakfast, room service, scenic views and easy online booking."}
                </p>
              </div>
            </div>
          </div>
          </Card>
      </div>
      </div>

      {/* Save Button */}
      {
      submitLoading ?<Button
          className="w-full bg-accent-foreground hover:bg-accent-foreground/90 py-6 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Loader2 className="w-5 h-5 mr-3" />
          Saving changes...
        </Button> :  
        <Button
          onClick={handleSave}
          className="w-full cursor-pointer bg-accent hover:bg-accent/60 py-6 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="w-5 h-5 mr-3" />
          Save All Changes
        </Button>}
    </div>
  )
}
