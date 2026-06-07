// This file is the route for URL "/register".
// In Next.js App Router, the folder name becomes the URL.
// We keep this file VERY small — just shows the form component.

import RegisterForm from "@/components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F1] py-12 px-4">
      <RegisterForm />
    </main>
  );
}