import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { SequelizeConfigFactory } from './sequelize-config.factory';

describe('SequelizeConfigFactory', () => {
  it('should return test db configuration', () => {
    const dbConfig = {
      DB_DIALECT: 'sqlite',
      DB_HOST: 'localhost',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'root',
      DB_STORAGE: 'database.sqlite',
    };
    const expected: SequelizeModuleOptions = {
      dialect: 'sqlite',
      host: 'localhost',
      username: 'root',
      password: 'root',
      storage: 'database.sqlite',
      autoLoadModels: true,
      synchronize: true,
    };
    const configService = <ConfigService>{ get: (key: string) => dbConfig[key] };

    const { logging, ...result } = SequelizeConfigFactory(configService);
    expect(result).toEqual(expected);
    expect(logging).toBeDefined();
  });
});
