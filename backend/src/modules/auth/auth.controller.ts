import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckEmailQueryDto } from './dtos/check-email.dto';
import { CheckMobileQueryDto } from './dtos/check-mobile.dto';
import { CheckRegistrationNumberQueryDto } from './dtos/check-registration-number.dto';
import { RegisterOrganisationDto } from './dtos/register-organisation.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

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

  // POST /api/v1/auth/verify-otp
  @Post('verify-otp')
  verify(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
