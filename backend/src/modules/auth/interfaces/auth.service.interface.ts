import { AvailabilityResponseDto } from '../dtos/availability-response.dto';
import { RegisterOrganisationDto } from '../dtos/register-organisation.dto';
import { RegisterOrganisationResponseDto } from '../dtos/register-organisation-response.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { VerifyOtpResponseDto } from '../dtos/verify-otp-response.dto';
import { PasswordSetupInfoResponseDto } from '../dtos/password-setup-info-response.dto';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { SetPasswordResponseDto } from '../dtos/set-password-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserInfoDto } from '../dtos/user-info.dto';
import { RequestPasswordSetupDto } from '../dtos/request-password-setup.dto';
import { RequestPasswordSetupResponseDto } from '../dtos/request-password-setup-response.dto';

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
  getPasswordSetupInfo(token: string): Promise<PasswordSetupInfoResponseDto>;
  setPassword(dto: SetPasswordDto): Promise<SetPasswordResponseDto>;
  login(dto: LoginDto): Promise<{ token: string }>;
  getMe(userId: number): Promise<UserInfoDto>;
  requestPasswordSetup(
    dto: RequestPasswordSetupDto,
  ): Promise<RequestPasswordSetupResponseDto>;
}
