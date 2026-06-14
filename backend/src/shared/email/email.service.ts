import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// All email sending goes through this service.
// We use Brevo's HTTP API (over https / port 443) instead of SMTP, because
// Render's free tier blocks SMTP ports. HTTPS is never blocked.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly fromName: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    this.fromName =
      this.configService.get<string>('SMTP_FROM_NAME') || 'Haarvo';
    this.fromEmail = this.configService.get<string>('SMTP_FROM_EMAIL') || '';
  }

  // Low-level helper: sends ONE email through Brevo's HTTP API.
  // 'fetch' is built into Node, so we don't need any extra package.
  private async sendEmail(
    toEmail: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email: toEmail }],
        subject,
        htmlContent: html,
      }),
    });

    // If Brevo didn't accept it, log its reason so we can debug from the logs.
    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(
        `Brevo API failed (${response.status}) sending to ${toEmail}: ${errorText}`,
      );
      throw new InternalServerErrorException(
        'Could not send email. Please try again.',
      );
    }
  }

  // Sends the OTP email.
  async sendOtpEmail(
    toEmail: string,
    otpCode: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const expiryMinutes = Math.floor(expiresInSeconds / 60);
    const html = this.buildOtpEmailHtml(otpCode, expiryMinutes);
    await this.sendEmail(toEmail, 'Your Haarvo verification code', html);
    this.logger.log(`OTP email sent to ${toEmail}`);
  }

  // Sends a clickable password-setup link.
  async sendPasswordSetupLinkEmail(
    toEmail: string,
    setupUrl: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const expiryMinutes = Math.floor(expiresInSeconds / 60);
    const html = this.buildPasswordSetupEmailHtml(setupUrl, expiryMinutes);
    await this.sendEmail(toEmail, 'Set your Haarvo password', html);
    this.logger.log(`Password setup link sent to ${toEmail}`);
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
