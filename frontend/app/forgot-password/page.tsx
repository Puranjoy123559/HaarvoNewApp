import RequestPasswordSetupForm from "@/components/auth/RequestPasswordSetupForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F1] py-12 px-4 flex items-start justify-center">
      <RequestPasswordSetupForm />
    </main>
  );
}