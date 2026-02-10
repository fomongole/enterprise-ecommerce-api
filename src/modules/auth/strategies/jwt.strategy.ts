import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super({
      // 1. Where to find the token? (Authorization: Bearer <token>)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Ignore expired tokens? No.
      ignoreExpiration: false,
      // 3. What is the secret key?
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  // 4. Validation logic
  async validate(payload: any) {
    // Payload contains the data we signed (sub = userId, email)
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new UnauthorizedException();
    }

    // This return value is attached to the Request as `req.user`
    return user;
  }
}
