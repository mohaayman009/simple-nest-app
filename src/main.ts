import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/fillters/all-exceptions.filter';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  // Enable Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unexpected fields
      forbidNonWhitelisted: true, // Throw error on extra fields
      transform: true, // Auto-transform DTOs
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            message: 'Validation failed',
            errors: errors.map((error) => ({
              field: error.property,
              errors: Object.values(error.constraints || {}),// الايروز المتعلقة بفيلد معين في الdto 
            })),
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  // Apply Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();


  // listen on port
  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((e) => console.error(e));

