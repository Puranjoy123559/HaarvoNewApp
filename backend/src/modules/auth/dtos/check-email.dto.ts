import { IsEmail, IsNotEmpty } from 'class-validator';

// GET /api/v1/auth/check-email?email=foo@bar.com
export class CheckEmailQueryDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
