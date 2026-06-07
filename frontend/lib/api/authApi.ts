import { apiGet, apiPost } from "./apiClient";
import {
  AvailabilityResponse,
  RegisterOrganisationRequest,
  RegisterOrganisationResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  PasswordSetupInfoResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserInfo,
  RequestPasswordSetupRequest,
  RequestPasswordSetupResponse,
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
  getPasswordSetupInfo: (token: string) =>
    apiGet<PasswordSetupInfoResponse>(
      `/auth/password-setup-info?token=${encodeURIComponent(token)}`,
    ),
  setPassword: (data: SetPasswordRequest) =>
    apiPost<SetPasswordResponse, SetPasswordRequest>(
      "/auth/set-password",
      data,
    ),

  // ===== New in Stage 12 =====
  login: (data: LoginRequest) =>
    apiPost<LoginResponse, LoginRequest>("/auth/login", data),
  logout: () => apiPost<LogoutResponse, object>("/auth/logout", {}),
  me: () => apiGet<UserInfo>("/auth/me"),
  requestPasswordSetup: (data: RequestPasswordSetupRequest) =>
    apiPost<RequestPasswordSetupResponse, RequestPasswordSetupRequest>(
      "/auth/request-password-setup",
      data,
    ),
};