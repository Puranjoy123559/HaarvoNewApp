// TS types that match the response DTOs returned by the backend.
// One of the big wins of TypeScript: change the backend DTO and the compiler
// tells you every spot on the frontend that needs to be updated.

export interface DropdownOption {
  id: number;
  name: string;
  code: string;
}

export interface District {
  id: number;
  name: string;
  code: string;
  stateId: number;
}

export interface MemberRange {
  id: number;
  label: string;
  code: string;
  minValue: number;
  maxValue: number | null;
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

// Payload sent to POST /auth/register-organisation
export interface RegisterOrganisationRequest {
  organisationName: string;
  organisationTypeId: number;
  registrationNumber: string;
  yearOfRegistration?: number;
  stateId: number;
  districtId: number;
  memberRangeId?: number;
  primaryCropId?: number;
  promotingAgencyId?: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  designationId?: number;
  languageId: number;
  agreedToTerms: boolean;
}

// Response from POST /auth/register-organisation
export interface RegisterOrganisationResponse {
  otpToken: string;
  expiresInSeconds: number;
  maskedEmail: string;
}

// Sent to POST /auth/verify-otp
export interface VerifyOtpRequest {
  otpToken: string;
  otpCode: string;
}

// Returned from POST /auth/verify-otp
export interface VerifyOtpResponse {
  success: boolean;
  organisationId: number;
  userId: number;
  message: string;
  passwordSetupToken: string;
  passwordSetupExpiresInSeconds: number;
}

// GET /auth/password-setup-info?token=...
export interface PasswordSetupInfoResponse {
  email: string;
  expiresInSeconds: number;
}

// POST /auth/set-password
export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
}

// POST /auth/login
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
}

// GET /auth/me
export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  organisationId: number;
}

// POST /auth/request-password-setup
export interface RequestPasswordSetupRequest {
  email: string;
}
export interface RequestPasswordSetupResponse {
  message: string;
}

// POST /auth/logout
export interface LogoutResponse {
  success: boolean;
  message: string;
}