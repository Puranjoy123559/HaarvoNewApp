import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OtpStatus } from '../../../common/enums/otp-status.enum';

// Temporary holding table for in-flight registrations.
// When the user verifies the OTP, we move the data into organisations + users
// and mark this row VERIFIED.
@Entity('otp_verifications')
export class OtpVerification extends BaseEntity {
  // Random UUID we hand back to the frontend so it can identify this OTP
  // session on the verify call.
  @Column({ type: 'uuid', unique: true })
  otpToken!: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Column({ type: 'varchar', length: 15 })
  mobileNumber!: string;

  // We never store the OTP in plain text — always SHA-256 hashed.
  @Column({ type: 'varchar', length: 255 })
  otpCodeHash!: string;

  // The full form payload, kept here until OTP is verified.
  // JSONB lets PostgreSQL store + index JSON natively.
  @Column({ type: 'jsonb' })
  registrationPayload!: Record<string, unknown>;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  // How many wrong tries — we'll lock after 5 in a future stage.
  @Column({ type: 'int', default: 0 })
  attemptCount!: number;

  @Column({ type: 'varchar', length: 20, default: OtpStatus.PENDING })
  status!: OtpStatus;
}
