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
}