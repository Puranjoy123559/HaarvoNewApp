import { IsNotEmpty, MaxLength } from 'class-validator';

// GET /api/v1/auth/check-registration-number?registrationNumber=ABC12345
export class CheckRegistrationNumberQueryDto {
  @IsNotEmpty()
  @MaxLength(50)
  registrationNumber!: string;
}
