import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtConfigFactory } from './jwt-config.factory';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JwtConfigFactory,
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule],
})
export class AuthenticationModule {}
