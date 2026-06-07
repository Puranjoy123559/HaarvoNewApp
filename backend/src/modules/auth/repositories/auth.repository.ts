import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Organisation } from '../../organisations/entities/organisation.entity';
import { OtpVerification } from '../entities/otp-verification.entity';
import { RegisterOrganisationDto } from '../dtos/register-organisation.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Organisation)
    private readonly organisationRepo: Repository<Organisation>,

    @InjectRepository(OtpVerification)
    private readonly otpRepo: Repository<OtpVerification>,

    // DataSource is needed to run a transaction. Same idea as
    // using (var tx = db.Database.BeginTransaction()) in EF Core.
    private readonly dataSource: DataSource,
  ) {}

  // ===== Availability lookups =====

  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email, isDeleted: false } });
  }

  findUserByMobile(mobileNumber: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { mobileNumber, isDeleted: false },
    });
  }

  findOrganisationByRegistrationNumber(
    registrationNumber: string,
  ): Promise<Organisation | null> {
    return this.organisationRepo.findOne({
      where: { registrationNumber, isDeleted: false },
    });
  }

  // ===== OTP =====

  createOtpVerification(
    data: Partial<OtpVerification>,
  ): Promise<OtpVerification> {
    const entity = this.otpRepo.create(data);
    return this.otpRepo.save(entity);
  }

  findOtpByToken(otpToken: string): Promise<OtpVerification | null> {
    return this.otpRepo.findOne({ where: { otpToken } });
  }

  saveOtp(otp: OtpVerification): Promise<OtpVerification> {
    return this.otpRepo.save(otp);
  }

  // ===== Commit registration (atomic) =====

  // Creates the Organisation AND User in a single transaction.
  // If either insert fails, the whole thing rolls back — we never end up
  // with an Organisation but no User (or vice versa).
  // Creates the Organisation AND User in a single transaction.
  // The setup token + expiry are saved on the user so they can set their
  // password right after verifying.
  async commitRegistration(
    payload: RegisterOrganisationDto,
    passwordSetupToken: string,
    passwordSetupExpiresAt: Date,
  ): Promise<{ organisationId: number; userId: number }> {
    return this.dataSource.transaction(async (manager) => {
      const orgRepo = manager.getRepository(Organisation);
      const userRepo = manager.getRepository(User);

      const org = orgRepo.create({
        name: payload.organisationName,
        organisationTypeId: payload.organisationTypeId,
        registrationNumber: payload.registrationNumber,
        yearOfRegistration: payload.yearOfRegistration ?? null,
        stateId: payload.stateId,
        districtId: payload.districtId,
        memberRangeId: payload.memberRangeId ?? null,
        primaryCropId: payload.primaryCropId ?? null,
        promotingAgencyId: payload.promotingAgencyId ?? null,
      });
      const savedOrg = await orgRepo.save(org);

      const user = userRepo.create({
        organisationId: savedOrg.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        countryCode: payload.countryCode,
        mobileNumber: payload.mobileNumber,
        designationId: payload.designationId ?? null,
        languageId: payload.languageId,
        isEmailVerified: true,
        isMobileVerified: false,
        passwordSetupToken,
        passwordSetupExpiresAt,
      });
      const savedUser = await userRepo.save(user);

      return { organisationId: savedOrg.id, userId: savedUser.id };
    });
  }

  // Find a user by their password-setup token. Used by both
  // GET /password-setup-info and POST /set-password.
  findUserByPasswordSetupToken(token: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { passwordSetupToken: token, isDeleted: false },
    });
  }

  // Saves the new hashed password AND clears the setup token so it can't
  // be reused.
  async setUserPassword(userId: number, passwordHash: string): Promise<void> {
    await this.userRepo.update(userId, {
      passwordHash,
      passwordSetupToken: null,
      passwordSetupExpiresAt: null,
    });
  }

  findUserById(userId: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId, isDeleted: false } });
  }

  async updatePasswordSetupToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.userRepo.update(userId, {
      passwordSetupToken: token,
      passwordSetupExpiresAt: expiresAt,
    });
  }
}
