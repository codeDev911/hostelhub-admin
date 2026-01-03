"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SetNewPassword from "./SetNewPassword";
import SendEmail from "./SendEmail";

// 1. Create a sub-component for the logic
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <SendEmail />;
  }

  return <SetNewPassword token={token} />;
}

// 2. Wrap it in Suspense in the exported page
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}