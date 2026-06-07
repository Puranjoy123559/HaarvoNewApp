"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/authApi";

export default function CreatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  // Loaded from /password-setup-info — shown in the read-only field.
    const [email, setEmail] = useState("");
    // If there's no token in the URL we already know it's an error, so we
    // initialise the state directly. This way the effect below never has to
    // call setState synchronously, which React 19's lint rule flags.
    const [isLoading, setIsLoading] = useState(!!token);
    const [loadError, setLoadError] = useState(
        token ? "" : "Missing token in URL.",
    );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ===== On mount, fetch the email tied to this token =====
  // The "no token" case is already handled by the initial useState values
  // above — this effect only runs the actual API call when a token exists.
  useEffect(() => {
    if (!token) return;

    authApi
      .getPasswordSetupInfo(token)
      .then((info) => setEmail(info.email))
      .catch((e) => {
        const message = e instanceof Error ? e.message : "Invalid link";
        setLoadError(message);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // ===== Simple client-side password rules =====
  const validate = (): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.setPassword({ token, password });
      setSuccessMessage(response.message);

      // Brief pause, then send them to login to sign in with the new password.
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not set password";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== Render: loading / error / form / success =====

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0E3D2E] to-[#145239] px-6 py-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Haarvo<span className="text-[#7FD09A]">.</span>
        </h1>
      </div>

      <div className="px-6 sm:px-10 py-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
          Create your password
        </h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          Choose a password for your Haarvo account.
        </p>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-8 text-center text-gray-600 text-sm">
            Loading...
          </div>
        )}

        {/* Error loading the token */}
        {!isLoading && loadError && (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 rounded-lg p-5 text-center">
            <p className="font-semibold">{loadError}</p>
            <p className="text-sm mt-2 mb-4">
              Click the button below to get a fresh link by email.
            </p>
            <a
              href="/forgot-password"
              className="inline-block bg-[#0E3D2E] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2E22] transition"
            >
              Send me a new link
            </a>
          </div>
        )}

        {/* Success state after submit */}
        {!isLoading && !loadError && successMessage && (
          <div className="mt-8 bg-green-50 border border-green-200 text-green-800 rounded-lg p-5 text-center">
            <p className="font-semibold">{successMessage}</p>
            <p className="text-sm mt-2">Redirecting...</p>
          </div>
        )}

        {/* The form */}
        {!isLoading && !loadError && !successMessage && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Min 8 characters, 1 letter + 1 number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Re-type the password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !password || !confirmPassword}
              className="w-full bg-[#0E3D2E] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#0A2E22] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}