// All possible states of an OTP record.
// Using an enum (instead of magic strings) avoids typos.
export enum OtpStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}
