"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; 

export default function SendEmail() {
   
  const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
 

  const handleSubmit = async () => {
    
    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-link",{ method:"POST", body:JSON.stringify({email,purpose:"reset-admin-password"})});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast("Email sent! Check your inbox for further instructions.");
      setEmail("");
    } catch (error: any) {
      toast("Sending email failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl   bg-card p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Enter email</h1>
          <p className="text-sm text-muted-foreground">
            We'll send you a link to reset your password, Enter the email associated
            with your admin account. Link will be expired in 5 minutes.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e)=>{
            e.preventDefault()
            handleSubmit()
        }}>
           <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-4 pr-4 py-2.5 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>
            

          {/* Button */}
          <Button 
            disabled={loading}
            className="w-full h-12 text-base cursor-pointer hover:bg-accent/80 rounded-full font-semibold text-slate-900"
            style={{ backgroundColor: "#edce00" }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{" "}
          <a
            href="/admin-portal-login"
            className="font-medium underline"
            style={{ color: "#edce00" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
