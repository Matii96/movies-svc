import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

/**
 * @param {ConfigService} config
 * @returns {SequelizeModuleOptions}
 */
export function SequelizeConfigFactory(config: ConfigService): SequelizeModuleOptions {
  const dbConfig: SequelizeModuleOptions = {
    dialect: config.get('DB_DIALECT'),
    host: config.get('DB_HOST'),
    port: config.get('DB_PORT'),
    username: config.get('DB_USERNAME'),
    password: config.get('DB_PASSWORD'),
    storage: config.get('DB_STORAGE'),
    database: config.get('DB_NAME'),
    autoLoadModels: true,
    synchronize: true,
    logging: false,
  };

  // Add logging
  if (process.env.NODE_ENV !== 'production') {
    const logger = new Logger('Database');
    dbConfig.logging = (msg: any) => logger.debug(msg);
  }

  return dbConfig;
}
