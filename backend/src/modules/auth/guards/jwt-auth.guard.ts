import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Reads the haarvo_session cookie, verifies the JWT inside, and attaches
// the payload to request.user. Same idea as an [Authorize] attribute in .NET.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<
        Request & { cookies?: Record<string, string>; user?: unknown }
      >();

    // Cast as string to satisfy ESLint, since Express cookies default to 'any'
    const token = request.cookies?.['haarvo_session'] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Not logged in');
    }

    try {
      // Pass the type here -------------------------v
      const payload = this.jwtService.verify<Record<string, unknown>>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Session expired or invalid');
    }
  }
}
