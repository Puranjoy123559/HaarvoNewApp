import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { AuthRepository } from './repositories/auth.repository';
import { EmailService } from '../../shared/email/email.service';
import { IAuthService } from './interfaces/auth.service.interface';
import { AvailabilityResponseDto } from './dtos/availability-response.dto';
import { RegisterOrganisationDto } from './dtos/register-organisation.dto';
import { RegisterOrganisationResponseDto } from './dtos/register-organisation-response.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { VerifyOtpResponseDto } from './dtos/verify-otp-response.dto';
import { OtpStatus } from '../../common/enums/otp-status.enum';

const OTP_EXPIRY_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  // ===== Availability checks =====

  async checkEmailAvailability(
    email: string,
  ): Promise<AvailabilityResponseDto> {
    const existing = await this.authRepository.findUserByEmail(
      email.trim().toLowerCase(),
    );
    return existing
      ? { available: false, message: 'This email is already registered' }
      : { available: true };
  }

  async checkMobileAvailability(
    mobileNumber: string,
  ): Promise<AvailabilityResponseDto> {
    const existing = await this.authRepository.findUserByMobile(
      mobileNumber.trim(),
    );
    return existing
      ? {
          available: false,
          message: 'This mobile number is already registered',
        }
      : { available: true };
  }

  async checkRegistrationNumberAvailability(
    registrationNumber: string,
  ): Promise<AvailabilityResponseDto> {
    const existing =
      await this.authRepository.findOrganisationByRegistrationNumber(
        registrationNumber.trim().toUpperCase(),
      );
    return existing
      ? {
          available: false,
          message: 'This registration number is already registered',
        }
      : { available: true };
  }

  // ===== Register (Stage 8) =====

  async registerOrganisation(
    dto: RegisterOrganisationDto,
  ): Promise<RegisterOrganisationResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const mobileNumber = dto.mobileNumber.trim();
    const registrationNumber = dto.registrationNumber.trim().toUpperCase();

    const [existingEmail, existingMobile, existingRegNum] = await Promise.all([
      this.authRepository.findUserByEmail(email),
      this.authRepository.findUserByMobile(mobileNumber),
      this.authRepository.findOrganisationByRegistrationNumber(
        registrationNumber,
      ),
    ]);
    if (existingEmail)
      throw new ConflictException('Email is already registered');
    if (existingMobile)
      throw new ConflictException('Mobile number is already registered');
    if (existingRegNum)
      throw new ConflictException('Registration number is already registered');

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const otpCodeHash = createHash('sha256').update(otpCode).digest('hex');
    const otpToken = randomUUID();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);

    await this.authRepository.createOtpVerification({
      otpToken,
      email,
      mobileNumber,
      otpCodeHash,
      registrationPayload: { ...dto, email, mobileNumber, registrationNumber },
      expiresAt,
      status: OtpStatus.PENDING,
    });

    // Send the OTP to the user's real inbox.
    // If sending fails we throw, so the frontend can show the user.
    await this.emailService.sendOtpEmail(email, otpCode, OTP_EXPIRY_SECONDS);

    return {
      otpToken,
      expiresInSeconds: OTP_EXPIRY_SECONDS,
      maskedEmail: this.maskEmail(email),
    };
  }

  // ===== Verify OTP (new) =====

  async verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    // 1. Find OTP record.
    const otpRecord = await this.authRepository.findOtpByToken(dto.otpToken);
    if (!otpRecord) {
      throw new NotFoundException(
        'OTP session not found. Please register again.',
      );
    }

    // 2. Has it already been used?
    if (otpRecord.status === OtpStatus.VERIFIED) {
      throw new BadRequestException('This OTP has already been verified.');
    }

    // 3. Expired?
    if (otpRecord.expiresAt < new Date()) {
      otpRecord.status = OtpStatus.EXPIRED;
      await this.authRepository.saveOtp(otpRecord);
      throw new BadRequestException(
        'OTP has expired. Please go back and register again.',
      );
    }

    // 4. Too many wrong tries already?
    if (otpRecord.attemptCount >= MAX_OTP_ATTEMPTS) {
      otpRecord.status = OtpStatus.FAILED;
      await this.authRepository.saveOtp(otpRecord);
      throw new BadRequestException(
        'Too many wrong attempts. Please register again.',
      );
    }

    // 5. Hash the input and compare.
    const inputHash = createHash('sha256').update(dto.otpCode).digest('hex');
    if (inputHash !== otpRecord.otpCodeHash) {
      otpRecord.attemptCount += 1;
      await this.authRepository.saveOtp(otpRecord);
      const triesLeft = MAX_OTP_ATTEMPTS - otpRecord.attemptCount;
      throw new BadRequestException(
        `Wrong OTP. ${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left.`,
      );
    }

    // 6. SUCCESS — commit the registration (org + user) atomically.
    const payload =
      otpRecord.registrationPayload as unknown as RegisterOrganisationDto;
    const { organisationId, userId } =
      await this.authRepository.commitRegistration(payload);

    // 7. Mark OTP as verified so it can't be reused.
    otpRecord.status = OtpStatus.VERIFIED;
    await this.authRepository.saveOtp(otpRecord);

    return {
      success: true,
      organisationId,
      userId,
      message: 'Registration completed successfully',
    };
  }

  // Returns "pu***@gmail.com"
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}
