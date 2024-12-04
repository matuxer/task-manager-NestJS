import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
      transform: true, // Convierte los datos (por ejemplo, de strings a números)
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
