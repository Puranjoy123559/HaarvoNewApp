import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// The payload the frontend sends to join the pilot waitlist.
// The decorators are the same idea as [Required], [MaxLength] etc. in .NET.
export class CreatePilotWaitlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName!: string;

  @IsString()
  @MaxLength(5)
  countryCode!: string;

  // Must be exactly 10 digits — same rule as the register form.
  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobileNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  organisationName!: string;

  // @Type(() => Number) converts the incoming value to a number before
  // validation, because JSON values can arrive as strings.
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stateId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  districtId!: number;

  // Primary crop is optional.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  primaryCropId?: number;
}
