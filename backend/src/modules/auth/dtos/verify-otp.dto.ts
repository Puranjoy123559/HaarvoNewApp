import { IsUUID, Matches } from 'class-validator';

// What the frontend sends to /auth/verify-otp
export class VerifyOtpDto {
  @IsUUID()
  otpToken!: string;

  @Matches(/^\d{6}$/, { message: 'OTP must be exactly 6 digits' })
  otpCode!: string;
}
