import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(4000);
  console.log('🚀 GraphQL server running on http://localhost:4000/graphql');
}

bootstrap();