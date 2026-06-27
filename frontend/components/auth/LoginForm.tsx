"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/authApi";
import Logo from "@/components/ui/Logo";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.login({ email: email.trim(), password });
      // Cookie is set by the server in the response. Go to dashboard.
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
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
          Sign in
        </h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          Welcome back to Haarvo.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Email
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

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0E3D2E] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#0A2E22] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

        <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              <a
                href="/forgot-password"
                className="text-[#0E3D2E] font-semibold underline"
              >
                Create new password / Forgot password?
              </a>
            </p>
            <p>
              New here?{" "}
              <a
                href="/register"
                className="text-[#0E3D2E] font-semibold underline"
              >
                Register your organisation
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}