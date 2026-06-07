import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEmail,
  IsOptional,
  Matches,
  MaxLength,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// The full payload the frontend sends to register an organisation.
// class-validator decorators = the same idea as [Required], [Range],
// [EmailAddress] data annotations in .NET.
export class RegisterOrganisationDto {
  // ===== Organisation =====
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  organisationName!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  organisationTypeId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registrationNumber!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearOfRegistration?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  stateId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  districtId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  memberRangeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  primaryCropId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  promotingAgencyId?: number;

  // ===== User (Primary Manager / CEO) =====
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(5)
  countryCode!: string;

  @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
  mobileNumber!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  designationId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  languageId!: number;

  // ===== Consent =====
  @IsBoolean()
  agreedToTerms!: boolean;
}
