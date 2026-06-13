import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route will start with /api/v1 - e.g. http://localhost:3001/api/v1/...
  app.setGlobalPrefix('api/v1');

  // Automatically validates incoming request data against our DTO rules.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any properties not defined in the DTO
      forbidNonWhitelisted: true, // throw an error if unknown properties are sent
      transform: true, // auto-convert types (e.g. "5" string -> 5 number)
    }),
  );

  // Lets NestJS read cookies from incoming requests via req.cookies.
  app.use(cookieParser());

  // Allow our frontend to call this API with cookies.
  // We read the allowed origin from an env var (CORS_ORIGIN) so we never
  // hardcode it. Falls back to localhost for local development.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // '0.0.0.0' = listen on all network interfaces. Hosting platforms like
  // Koyeb run the app inside a container and need this — listening only on
  // localhost would make it unreachable from the internet.
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend is running on http://localhost:${port}/api/v1`);
}
bootstrap().catch((err) => {
  console.error('Error starting the server:', err);
});
