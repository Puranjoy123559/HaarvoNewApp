import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CheckEmailQueryDto } from './dtos/check-email.dto';
import { CheckMobileQueryDto } from './dtos/check-mobile.dto';
import { CheckRegistrationNumberQueryDto } from './dtos/check-registration-number.dto';
import { RegisterOrganisationDto } from './dtos/register-organisation.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { PasswordSetupInfoQueryDto } from './dtos/password-setup-info-query.dto';
import { SetPasswordDto } from './dtos/set-password.dto';
import { LoginDto } from './dtos/login.dto';
import { RequestPasswordSetupDto } from './dtos/request-password-setup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const COOKIE_NAME = 'haarvo_session';
// 7 days in milliseconds — matches JWT_EXPIRES_IN default.
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-email')
  checkEmail(@Query() query: CheckEmailQueryDto) {
    return this.authService.checkEmailAvailability(query.email);
  }

  @Get('check-mobile')
  checkMobile(@Query() query: CheckMobileQueryDto) {
    return this.authService.checkMobileAvailability(query.mobileNumber);
  }

  @Get('check-registration-number')
  checkRegistrationNumber(@Query() query: CheckRegistrationNumberQueryDto) {
    return this.authService.checkRegistrationNumberAvailability(
      query.registrationNumber,
    );
  }

  @Post('register-organisation')
  register(@Body() dto: RegisterOrganisationDto) {
    return this.authService.registerOrganisation(dto);
  }

  @Post('verify-otp')
  verify(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Get('password-setup-info')
  passwordSetupInfo(@Query() query: PasswordSetupInfoQueryDto) {
    return this.authService.getPasswordSetupInfo(query.token);
  }

  @Post('set-password')
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto);
  }

  // ===== Login (sets HTTP-only cookie) =====
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    // passthrough: true → we set cookies but Nest still serializes our return value.
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.login(dto);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true, // JS can't read it — XSS-safe
      sameSite: 'lax', // CSRF protection for same-site requests
      secure: false, // set to true in production (HTTPS only)
      maxAge: COOKIE_MAX_AGE_MS,
      path: '/',
    });

    return { success: true, message: 'Logged in successfully' };
  }

  // ===== Logout (clears the cookie) =====
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { success: true, message: 'Logged out' };
  }

  // ===== Who am I? — protected by guard =====
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request & { user?: { userId: number } }) {
    return this.authService.getMe(req.user!.userId);
  }

  // ===== Send me a fresh password-setup link =====
  @Post('request-password-setup')
  requestPasswordSetup(@Body() dto: RequestPasswordSetupDto) {
    return this.authService.requestPasswordSetup(dto);
  }
}
