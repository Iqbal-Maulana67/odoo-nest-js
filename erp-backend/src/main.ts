// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS agar Next.js frontend bisa akses
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Aktifkan validasi DTO otomatis (untuk class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // buang field yang tidak ada di DTO
      forbidNonWhitelisted: false,
      transform: true,        // auto-convert tipe data (string -> number, dll)
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Backend berjalan di: http://localhost:${port}`);
  console.log(`📦 Odoo terhubung di: http://${process.env.ODOO_HOST}:${process.env.ODOO_PORT}\n`);
}

bootstrap();