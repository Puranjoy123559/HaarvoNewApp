import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './repositories/auth.repository';
import { IAuthService } from './interfaces/auth.service.interface';
import { AvailabilityResponseDto } from './dtos/availability-response.dto';
import { RegisterOrganisationDto } from './dtos/register-organisation.dto';
import { RegisterOrganisationResponseDto } from './dtos/register-organisation-response.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { VerifyOtpResponseDto } from './dtos/verify-otp-response.dto';
import { PasswordSetupInfoResponseDto } from './dtos/password-setup-info-response.dto';
import { SetPasswordDto } from './dtos/set-password.dto';
import { SetPasswordResponseDto } from './dtos/set-password-response.dto';
import { LoginDto } from './dtos/login.dto';
import { UserInfoDto } from './dtos/user-info.dto';
import { RequestPasswordSetupDto } from './dtos/request-password-setup.dto';
import { RequestPasswordSetupResponseDto } from './dtos/request-password-setup-response.dto';
import { OtpStatus } from '../../common/enums/otp-status.enum';
import { EmailService } from '../../shared/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

const OTP_EXPIRY_SECONDS = 300;
const MAX_OTP_ATTEMPTS = 5;

// Password setup link is valid for 15 minutes.
const PASSWORD_SETUP_EXPIRY_SECONDS = 15 * 60;

// bcrypt cost factor. 10 is a good default — secure + fast enough.
const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    // 6. SUCCESS — generate password setup token first so we can save it
    //    with the user, then commit the registration atomically.
    const payload =
      otpRecord.registrationPayload as unknown as RegisterOrganisationDto;
    const passwordSetupToken = randomUUID();
    const passwordSetupExpiresAt = new Date(
      Date.now() + PASSWORD_SETUP_EXPIRY_SECONDS * 1000,
    );

    const { organisationId, userId } =
      await this.authRepository.commitRegistration(
        payload,
        passwordSetupToken,
        passwordSetupExpiresAt,
      );

    // 7. Mark OTP as verified so it can't be reused.
    otpRecord.status = OtpStatus.VERIFIED;
    await this.authRepository.saveOtp(otpRecord);

    return {
      success: true,
      organisationId,
      userId,
      message: 'Registration completed successfully',
      passwordSetupToken,
      passwordSetupExpiresInSeconds: PASSWORD_SETUP_EXPIRY_SECONDS,
    };
  }

  // ===== Password setup =====

  // Called by GET /auth/password-setup-info to populate the create-password page.
  async getPasswordSetupInfo(
    token: string,
  ): Promise<PasswordSetupInfoResponseDto> {
    const user = await this.authRepository.findUserByPasswordSetupToken(token);

    if (!user || !user.passwordSetupExpiresAt) {
      throw new NotFoundException('Invalid or already-used password link.');
    }

    if (user.passwordSetupExpiresAt < new Date()) {
      throw new BadRequestException(
        'This password setup link has expired. Please request a new one.',
      );
    }

    const remaining = Math.max(
      0,
      Math.floor((user.passwordSetupExpiresAt.getTime() - Date.now()) / 1000),
    );

    return { email: user.email, expiresInSeconds: remaining };
  }

  // Called by POST /auth/set-password. Validates token, hashes password, saves.
  async setPassword(dto: SetPasswordDto): Promise<SetPasswordResponseDto> {
    const user = await this.authRepository.findUserByPasswordSetupToken(
      dto.token,
    );

    if (!user || !user.passwordSetupExpiresAt) {
      throw new NotFoundException('Invalid or already-used password link.');
    }

    if (user.passwordSetupExpiresAt < new Date()) {
      throw new BadRequestException(
        'This password setup link has expired. Please request a new one.',
      );
    }

    // Hash the password with bcrypt. The result includes the salt + rounds,
    // so we don't need to store anything else.
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.authRepository.setUserPassword(user.id, passwordHash);

    return { success: true, message: 'Password set successfully' };
  }

  // ===== Login (Stage 12) =====

  async login(dto: LoginDto): Promise<{ token: string }> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.authRepository.findUserByEmail(email);

    // Generic error to avoid revealing whether the email exists.
    const invalid = () =>
      new UnauthorizedException('Invalid email or password');

    if (!user) throw invalid();

    // Helpful (not security-critical) — tell them to set password first.
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Password not set yet. Use "Forgot password" to set one.',
      );
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw invalid();

    // Build the JWT payload — kept minimal on purpose.
    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  // ===== "Who am I?" — used by Dashboard to verify session =====

  async getMe(userId: number): Promise<UserInfoDto> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Session is no longer valid');
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organisationId: user.organisationId,
    };
  }

  // ===== Forgot / Set-new password link =====

  async requestPasswordSetup(
    dto: RequestPasswordSetupDto,
  ): Promise<RequestPasswordSetupResponseDto> {
    const genericResponse: RequestPasswordSetupResponseDto = {
      message:
        'If that email is registered, we have sent a password setup link to it.',
    };

    const email = dto.email.trim().toLowerCase();
    const user = await this.authRepository.findUserByEmail(email);
    // Email is not in our database — tell the user clearly.
    // (404 Not Found; the frontend shows this message in red.)
    if (!user) {
      throw new NotFoundException('This email is not yet registered');
    }

    const token = randomUUID();
    const expiresAt = new Date(
      Date.now() + PASSWORD_SETUP_EXPIRY_SECONDS * 1000,
    );
    await this.authRepository.updatePasswordSetupToken(
      user.id,
      token,
      expiresAt,
    );

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const setupUrl = `${frontendUrl}/create-password?token=${token}`;

    await this.emailService.sendPasswordSetupLinkEmail(
      user.email,
      setupUrl,
      PASSWORD_SETUP_EXPIRY_SECONDS,
    );

    return genericResponse;
  }

  // Returns "pu***@gmail.com"
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}
