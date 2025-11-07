import {redirect} from "next/navigation"
const page = () => {
    redirect("/admin")
  return (
    <div>redirecting...</div>
  )
}

export default page