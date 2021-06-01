import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Module is reposible for configuring sequelize and providing simple validation
 */
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
