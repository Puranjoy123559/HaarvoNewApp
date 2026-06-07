import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Organisation } from '../../organisations/entities/organisation.entity';
import { Designation } from '../../masters/entities/designation.entity';
import { Language } from '../../masters/entities/language.entity';

@Entity('users')
export class User extends BaseEntity {
  // Which organisation this user belongs to.
  @Column({ type: 'int' })
  organisationId!: number;

  @ManyToOne(() => Organisation)
  @JoinColumn({ name: 'organisation_id' })
  organisation!: Organisation;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  // UNIQUE — enforces the "email must be unique" rule.
  // We will store emails in lowercase (handled in the service layer later).
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  // Country code + mobile kept separate so we can normalize easily.
  @Column({ type: 'varchar', length: 5, default: '+91' })
  countryCode!: string;

  // UNIQUE — enforces the "mobile number must be unique" rule.
  @Column({ type: 'varchar', length: 15, unique: true })
  mobileNumber!: string;

  // Optional master FKs
  @Column({ type: 'int', nullable: true })
  designationId!: number | null;

  @ManyToOne(() => Designation)
  @JoinColumn({ name: 'designation_id' })
  designation!: Designation | null;

  @Column({ type: 'int', nullable: true })
  languageId!: number | null;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language!: Language | null;

  // Flipped to true after the OTP is verified (Stage we'll do later).
  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isMobileVerified!: boolean;

  // Left nullable for now — we will fill this once we decide the login flow
  // (email+password vs mobile+OTP). The column exists so we don't need a
  // schema change later.
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  // The one-time token used to set/reset password.
  // Stored as nullable + unique — once used, we clear it back to null.
  @Column({ type: 'uuid', nullable: true, unique: true })
  passwordSetupToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordSetupExpiresAt!: Date | null;
}
