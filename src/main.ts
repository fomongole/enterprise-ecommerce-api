import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 1. Register Multipart for File Uploads
  await app.register(multipart);

  // 2. Set Global Prefix to get /api/v1/...
  app.setGlobalPrefix('api/v1');

  app.useLogger(app.get(Logger));
  app.enableCors();

  await app.listen(3000, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`GraphQL Playground: ${await app.getUrl()}/graphiql`);
}
bootstrap();
