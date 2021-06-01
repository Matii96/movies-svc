import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';

/**
 *
 * @param {ConfigService} config
 * @returns {LoggerService}
 */
export const LoggerFactory = (config: ConfigService) =>
  WinstonModule.createLogger({
    transports: [
      new transports.Console({
        format: format.combine(format.timestamp(), format.ms(), utilities.format.nestLike()),
      }),
      new transports.File({
        dirname: resolve(__dirname, '..', 'logs'),
        filename: config.get('LOGS_FILENAME'),
        handleExceptions: config.get('LOGS_HANDLE_EXCEPTIONS'),
        maxsize: config.get('LOGS_MAX_SIZE'),
        maxFiles: config.get('LOGS_MAX_FILES'),
        format: format.combine(format.timestamp(), format.ms(), utilities.format.nestLike(), format.uncolorize()),
      }),
    ],
  });
