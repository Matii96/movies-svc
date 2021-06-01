import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfigFactory } from './sequelize-config.factory';
import { AuthenticationModule } from './authentication/authentication.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: SequelizeConfigFactory,
    }),
    AuthenticationModule,
    MoviesModule,
  ],
})
export class AppModule {}
