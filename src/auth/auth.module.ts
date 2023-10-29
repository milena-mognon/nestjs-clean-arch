import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ENV } from '@/env';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // registerAsync é usando para conseguir injetar algum serviço necessário para configurar esse módulo
      inject: [ConfigService], // lista de serviços que devem ser injetados quando estou registrando esse módulo
      global: true,
      useFactory(config: ConfigService<ENV, true>) {
        const private_key = config.get('JWT_PRIVATE_KEY', { infer: true });
        const public_key = config.get('JWT_PUBLIC_KEY', { infer: true });

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(private_key, 'base64'),
          publicKey: Buffer.from(public_key, 'base64'),
        };
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AuthModule {}
