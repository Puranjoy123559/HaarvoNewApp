import { Suspense } from "react";
import OtpVerifyForm from "@/components/auth/OtpVerifyForm";

// useSearchParams (used inside OtpVerifyForm) needs to be wrapped in Suspense
// in the App Router. This boundary handles that requirement.
export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F1] py-12 px-4 flex items-start justify-center">
      <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
        <OtpVerifyForm />
      </Suspense>
    </main>
  );
}