import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f2ef] p-4">
      <Suspense>
        <SignUp />
      </Suspense>
    </div>
  );
}