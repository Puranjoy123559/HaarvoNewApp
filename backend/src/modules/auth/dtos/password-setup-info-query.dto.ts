import { IsUUID } from 'class-validator';

// GET /auth/password-setup-info?token=...
export class PasswordSetupInfoQueryDto {
  @IsUUID()
  token!: string;
}
