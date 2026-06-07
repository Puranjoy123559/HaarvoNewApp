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

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend is running on http://localhost:${port}/api/v1`);
}
bootstrap().catch((err) => {
  console.error('Error starting the server:', err);
});
