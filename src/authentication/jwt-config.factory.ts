import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 *
 * @param {ConfigService} config
 * @returns {JwtModuleOptions}
 */
export const JwtConfigFactory = (config: ConfigService) => <JwtModuleOptions>{ secret: config.get('JWT_SECRET') };
