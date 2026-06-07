import { IsNotEmpty, Matches } from 'class-validator';

// GET /api/v1/auth/check-mobile?mobileNumber=9876543210
export class CheckMobileQueryDto {
  // Must be exactly 10 digits — same rule as the frontend.
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobileNumber!: string;
}
