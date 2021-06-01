import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { LoggerFactory } from './app.logger-factory';
import { HttpExceptionFilter } from './http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.useLogger(LoggerFactory(config));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start application
  const port = config.get<number>('PORT');
  await app.listen(port);
  Logger.log(`Listening in ${process.env.NODE_ENV} mode on port ${port}`);
}
bootstrap();
