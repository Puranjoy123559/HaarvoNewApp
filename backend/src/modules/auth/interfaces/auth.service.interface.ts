import { AvailabilityResponseDto } from '../dtos/availability-response.dto';
import { RegisterOrganisationDto } from '../dtos/register-organisation.dto';
import { RegisterOrganisationResponseDto } from '../dtos/register-organisation-response.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { VerifyOtpResponseDto } from '../dtos/verify-otp-response.dto';

export interface IAuthService {
  checkEmailAvailability(email: string): Promise<AvailabilityResponseDto>;
  checkMobileAvailability(
    mobileNumber: string,
  ): Promise<AvailabilityResponseDto>;
  checkRegistrationNumberAvailability(
    registrationNumber: string,
  ): Promise<AvailabilityResponseDto>;
  registerOrganisation(
    dto: RegisterOrganisationDto,
  ): Promise<RegisterOrganisationResponseDto>;
  verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto>;
}
