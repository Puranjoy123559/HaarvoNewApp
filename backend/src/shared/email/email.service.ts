import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// All email sending goes through this service.
// Any future module (password reset, welcome email, invoices)
// can inject EmailService and call it — same idea as an IEmailService
// in .NET that all features depend on.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    // The transporter is created ONCE when this service is constructed,
    // not every email. Reusing it is the recommended Nodemailer pattern.
    const port = Number(this.configService.get<string>('SMTP_PORT'));

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port,
      // secure=true is required for port 465 (SSL).
      // For port 587 (STARTTLS) it must be false.
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });

    const fromName =
      this.configService.get<string>('SMTP_FROM_NAME') || 'Haarvo';
    const fromEmail =
      this.configService.get<string>('SMTP_FROM_EMAIL') ||
      this.configService.get<string>('SMTP_USER');

    // Format: '"Display Name" <email@domain.com>'
    this.fromAddress = `"${fromName}" <${fromEmail}>`;
  }

  // Sends the OTP email. Throws if the SMTP server rejects the message.
  async sendOtpEmail(
    toEmail: string,
    otpCode: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const expiryMinutes = Math.floor(expiresInSeconds / 60);
    const html = this.buildOtpEmailHtml(otpCode, expiryMinutes);

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: toEmail,
        subject: 'Your Haarvo verification code',
        html,
      });
      this.logger.log(`OTP email sent to ${toEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${toEmail}`, error);
      throw new InternalServerErrorException(
        'Could not send verification email. Please try again.',
      );
    }
  }

  // Sends a clickable password-setup link.
  async sendPasswordSetupLinkEmail(
    toEmail: string,
    setupUrl: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const expiryMinutes = Math.floor(expiresInSeconds / 60);
    const html = this.buildPasswordSetupEmailHtml(setupUrl, expiryMinutes);

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: toEmail,
        subject: 'Set your Haarvo password',
        html,
      });
      this.logger.log(`Password setup link sent to ${toEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password setup link to ${toEmail}`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not send password setup email. Please try again.',
      );
    }
  }

  // Returns the HTML body of the OTP email.
  // Kept private here for simplicity. If we add more email types, we'll move
  // these templates into a /templates folder, similar to .cshtml in .NET.
  private buildOtpEmailHtml(otpCode: string, expiryMinutes: number): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
        <div style="background: linear-gradient(135deg, #0E3D2E, #145239); padding: 28px 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">
            Haarvo<span style="color: #7FD09A;">.</span>
          </h1>
          <p style="color: #C9E5D2; margin: 8px 0 0; font-size: 13px;">
            Powering traceable agri first-mile trade
          </p>
        </div>

        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
          <h2 style="font-size: 20px; margin: 0 0 12px; color: #111827;">
            Verify your email
          </h2>
          <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Use the one-time code below to finish registering your organisation on Haarvo.
          </p>

          <div style="background: #F2F8F4; border: 1px solid #CDE5D5; border-radius: 8px; padding: 22px; text-align: center; margin: 0 0 24px;">
            <p style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 700; color: #0E3D2E; letter-spacing: 10px; margin: 0;">
              ${otpCode}
            </p>
          </div>

          <p style="color: #6B7280; font-size: 13px; line-height: 1.5; margin: 0;">
            This code expires in <strong>${expiryMinutes} minutes</strong>. If you did not request this, you can safely ignore the email.
          </p>
        </div>

        <div style="background: #F9FAFB; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            &copy; Haarvo. This is an automated message — please do not reply.
          </p>
        </div>
      </div>
    `;
  }
  // Returns the HTML body of the password-setup link email.
  private buildPasswordSetupEmailHtml(
    setupUrl: string,
    expiryMinutes: number,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
        <div style="background: linear-gradient(135deg, #0E3D2E, #145239); padding: 28px 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
            Haarvo<span style="color: #7FD09A;">.</span>
          </h1>
        </div>
        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #E5E7EB; border-top: none;">
          <h2 style="font-size: 20px; margin: 0 0 12px; color: #111827;">Set your password</h2>
          <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Click the button below to set or reset the password for your Haarvo account.
          </p>
          <div style="text-align: center; margin: 0 0 24px;">
            <a href="${setupUrl}"
               style="display: inline-block; background: #0E3D2E; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 14px;">
              Set my password
            </a>
          </div>
          <p style="color: #6B7280; font-size: 13px; line-height: 1.5; margin: 0;">
            This link expires in <strong>${expiryMinutes} minutes</strong>. If you didn't request this, you can safely ignore it.
          </p>
        </div>
        <div style="background: #F9FAFB; padding: 16px 24px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #E5E7EB; border-top: none;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            &copy; Haarvo. This is an automated message — please do not reply.
          </p>
        </div>
      </div>
    `;
  }
}
