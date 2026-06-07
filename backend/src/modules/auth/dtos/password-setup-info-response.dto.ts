// What the create-password page receives so it can show the email
// in the read-only field at the top and the countdown if we add it later.
export class PasswordSetupInfoResponseDto {
  email!: string;
  expiresInSeconds!: number;
}
