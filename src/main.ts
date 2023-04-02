import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationException } from './validations/validation.exception';
import { ValidationFilter } from './validations/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            field: error.property,
            message: Object.values(error.constraints).join('. ').trim(),
          };
        });
        return new ValidationException(messages);
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
