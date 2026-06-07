// What we return after a successful OTP verification.
// passwordSetupToken is now included so the frontend can navigate to
// /create-password?token=... right after verifying.
export class VerifyOtpResponseDto {
  success!: boolean;
  organisationId!: number;
  userId!: number;
  message!: string;
  passwordSetupToken!: string;
  passwordSetupExpiresInSeconds!: number;
}
