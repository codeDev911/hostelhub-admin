"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation";

export default function SetNewPassword({token}: {token: string}) {
    if(!token){
        toast.error("Invalid or expired link");
        return null;
      }
    const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!token) {
      toast("Invalid or expire link");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-admin-password",{method:"POST", body:JSON.stringify({password, token})});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast("Password updated");

      router.push("/admin-portal-login");
    } catch (error: any) {
        
      toast("Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl   bg-card p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Create a new password for your HostelHub account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e)=>{
            e.preventDefault()
            handleSubmit()
        }}>
           <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full pl-4 pr-4 py-2.5 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-destructive p-2">{errors.password}</p>
              </div>
           <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={ confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter password again"
                    className="w-full pl-4 pr-4 py-2.5 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-destructive p-2">{errors.confirm}</p>
              </div>

          {/* Button */}
          <Button 
            disabled={loading}
            className="w-full h-12 text-base cursor-pointer hover:bg-accent/80 rounded-full font-semibold text-slate-900"
            style={{ backgroundColor: "#edce00" }}
          >
            {loading ? "Resetting..." : "Reset password"}
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
