import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV } from '@/env';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable() // todo provider precisa ter a annotation Injectable
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<ENV, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  // mesmo o token sendo validado pela key, se não tiver as propriedades obrigatórias não passa na validação
  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
