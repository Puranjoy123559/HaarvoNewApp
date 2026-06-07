import { IsUUID, MinLength, Matches } from 'class-validator';

// POST /auth/set-password
export class SetPasswordDto {
  @IsUUID()
  token!: string;

  // Minimum 8 characters, at least one letter + one number.
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Za-z]/, { message: 'Password must contain at least one letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  password!: string;
}
