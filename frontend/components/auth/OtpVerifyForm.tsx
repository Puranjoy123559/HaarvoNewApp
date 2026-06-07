"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/authApi";

const OTP_LENGTH = 6;

export default function OtpVerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query params handed in by the Register page.
  const otpToken = searchParams.get("token") || "";
  const maskedEmail = searchParams.get("email") || "your email";
  const initialExpiry = Number(searchParams.get("expires") || "300");

  const [otpCode, setOtpCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(initialExpiry);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ===== Countdown timer =====
  // Decrements remainingSeconds by 1 every second until it hits 0.
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Cleanup: clear the interval when the component unmounts or
    // when remainingSeconds changes (we re-create the interval).
    return () => clearInterval(intervalId);
  }, [remainingSeconds]);

  const isExpired = remainingSeconds === 0;

  // Format seconds -> "M:SS" e.g. 90 -> "1:30"
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (otpCode.length !== OTP_LENGTH) {
      setErrorMessage(`Please enter the ${OTP_LENGTH}-digit code`);
      return;
    }

    setIsVerifying(true);
    try {
      const response = await authApi.verifyOtp({ otpToken, otpCode });
      setSuccessMessage(response.message);

      // Brief pause so the user sees the green success card,
      // then navigate to the create-password page using the token
      // returned by verify-otp.
      setTimeout(() => {
        router.push(`/create-password?token=${response.passwordSetupToken}`);
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      setErrorMessage(message);
    } finally {
      setIsVerifying(false);
    }
  };

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
          Verify your OTP
        </h2>
        <p className="text-gray-600 text-sm text-center mt-2">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-800">{maskedEmail}</span>
        </p>

        {successMessage ? (
          <div className="mt-8 bg-green-50 border border-green-200 text-green-800 rounded-lg p-5 text-center">
            <p className="font-semibold text-base">{successMessage}</p>
            <p className="text-sm mt-2">Redirecting to home...</p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 text-center">
                Enter 6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => {
                  // Allow ONLY digits, max 6 chars
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, OTP_LENGTH);
                  setOtpCode(digits);
                  setErrorMessage("");
                }}
                maxLength={OTP_LENGTH}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
                autoFocus
                disabled={isExpired || isVerifying}
              />
              {errorMessage && (
                <p className="text-sm text-red-600 mt-3 text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="text-center">
              {isExpired ? (
                <p className="text-sm text-red-600 font-medium">
                  Code expired. Please go back and register again.
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Code expires in{" "}
                  <span className="font-semibold text-[#0E3D2E]">
                    {formatTime(remainingSeconds)}
                  </span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isExpired || isVerifying || otpCode.length !== OTP_LENGTH
              }
              className="w-full bg-[#0E3D2E] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#0A2E22] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Wrong email?{" "}
              <a
                href="/register"
                className="text-[#0E3D2E] font-semibold underline"
              >
                Go back
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}