// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el Frontend se conecte
  app.enableCors();

  // Habilitar el validador global para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora datos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay datos no permitidos
      transform: true, // Transforma tipos (ej. string de query a number)
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();