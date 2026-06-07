import { Suspense } from "react";
import CreatePasswordForm from "@/components/auth/CreatePasswordForm";

export default function CreatePasswordPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F1] py-12 px-4 flex items-start justify-center">
      <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
        <CreatePasswordForm />
      </Suspense>
    </main>
  );
}