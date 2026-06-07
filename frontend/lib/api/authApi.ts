import { apiGet, apiPost } from "./apiClient";
import {
  AvailabilityResponse,
  RegisterOrganisationRequest,
  RegisterOrganisationResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/api";

export const authApi = {
  checkEmail: (email: string) =>
    apiGet<AvailabilityResponse>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    ),

  checkMobile: (mobileNumber: string) =>
    apiGet<AvailabilityResponse>(
      `/auth/check-mobile?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    ),

  checkRegistrationNumber: (registrationNumber: string) =>
    apiGet<AvailabilityResponse>(
      `/auth/check-registration-number?registrationNumber=${encodeURIComponent(
        registrationNumber,
      )}`,
    ),

  registerOrganisation: (data: RegisterOrganisationRequest) =>
    apiPost<RegisterOrganisationResponse, RegisterOrganisationRequest>(
      "/auth/register-organisation",
      data,
    ),

  verifyOtp: (data: VerifyOtpRequest) =>
    apiPost<VerifyOtpResponse, VerifyOtpRequest>("/auth/verify-otp", data),
};