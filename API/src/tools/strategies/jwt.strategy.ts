import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    const secretKey = configService.get<string>('JWT_ACCESS_SECRET');
    if (!secretKey) {
      throw new Error('JWT_ACCESS_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    if (!payload.sub || !payload.email || !payload.role || !payload.nick_name) {
      throw new InternalServerErrorException('Token payload is missing required fields');
    }

    const id = Number(payload.sub);
    if (isNaN(id)) {
      throw new InternalServerErrorException('Token payload sub is not a valid number');
    }

    return { id, email: payload.email, role: payload.role, nick_name: payload.nick_name };
  }
}