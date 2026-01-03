"use client";
import { useSearchParams } from "next/navigation";
import SetNewPassword from "./SetNewPassword";
import SendEmail from "./SendEmail";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // reset token from email

  if(!token){
     return <SendEmail/>
  }else{
      return <SetNewPassword token={token} />;
  }

   
}
