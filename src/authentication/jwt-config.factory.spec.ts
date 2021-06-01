import { ConfigService } from '@nestjs/config';
import { JwtConfigFactory } from './jwt-config.factory';

describe('JwtConfigFactory', () => {
  it('should return jwt configuration', () => {
    const config = { JWT_SECRET: 'secret' };
    const configService = <ConfigService>{ get: (key: string) => config[key] };

    expect(JwtConfigFactory(configService)).toEqual({ secret: 'secret' });
  });
});
