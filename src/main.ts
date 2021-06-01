import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerFactory } from './app.logger-factory';
import { HttpExceptionFilter } from './http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.useLogger(LoggerFactory(config));
  app.useGlobalFilters(new HttpExceptionFilter());

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Movies api').setDescription('Movies microservice').setVersion('1.0').build(),
  );
  SwaggerModule.setup('docs', app, document);

  // For class-validator
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Start application
  const port = config.get<number>('PORT');
  await app.listen(port);
  Logger.log(`Listening in ${process.env.NODE_ENV} mode on port ${port}`);
}
bootstrap();
