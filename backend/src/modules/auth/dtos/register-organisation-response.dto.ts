// What the backend returns after the OTP has been "sent".
// The frontend uses otpToken to identify this session when verifying.
export class RegisterOrganisationResponseDto {
  otpToken!: string;
  expiresInSeconds!: number;
  // Email with most characters hidden, e.g. "pu***@gmail.com"
  // for the OTP screen to show "OTP sent to pu***@gmail.com"
  maskedEmail!: string;
}
