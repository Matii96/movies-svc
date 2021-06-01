import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from 'src/database/database.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MovieEntities } from './entities';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [SequelizeModule.forFeature(MovieEntities), DatabaseModule, AuthenticationModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
