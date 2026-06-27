"use client";

import { useState } from "react";
import { authApi } from "@/lib/api/authApi";
import Logo from "@/components/ui/Logo";

export default function RequestPasswordSetupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.requestPasswordSetup({
        email: email.trim(),
      });
      setSuccessMessage(response.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#023530] px-6 py-8 text-center">
        <div className="flex justify-center">
          <Logo className="h-14" href="/" />
        </div>
      </div>

      <div className="px-6 sm:px-10 py-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
          Set or reset password
        </h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          Enter the email you registered with. We&apos;ll send you a link to
          set a new password.
        </p>

        {successMessage ? (
          <div className="mt-8 bg-green-50 border border-green-200 text-green-800 rounded-lg p-5 text-center">
            <p className="font-semibold">{successMessage}</p>
            <p className="text-sm mt-2">
              The link is valid for 15 minutes. Check your inbox (and spam).
            </p>
            <p className="text-sm mt-4">
              <a
                href="/login"
                className="text-[#0E3D2E] font-semibold underline"
              >
                Back to sign in
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@organisation.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0E3D2E] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#0A2E22] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send setup link"}
            </button>

            <p className="text-center text-sm text-gray-600">
              <a
                href="/login"
                className="text-[#0E3D2E] font-semibold underline"
              >
                Back to sign in
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}