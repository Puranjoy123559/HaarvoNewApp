// What we return after a successful verification.
export class VerifyOtpResponseDto {
  success!: boolean;
  organisationId!: number;
  userId!: number;
  message!: string;
}
