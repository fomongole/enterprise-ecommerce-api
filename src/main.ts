import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  // Use Fastify instead of Express
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Use Pino Logger
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors();

  // 0.0.0.0 IS MANDATORY FOR DOCKER
  await app.listen(3000, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`GraphQL Playground: ${await app.getUrl()}/graphiql`);
}
bootstrap();
