import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { HealthResolver } from './graphql/resolvers/health.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { Category } from './modules/categories/entities/category.entity';
import { Product } from './modules/products/entities/product.entity';
import { ProductsModule } from './modules/products/products.module';
import { ProductImage } from './modules/products/entities/product-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 1. Database Connection (TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        // Explicitly list entities so TypeORM finds them
        entities: [User, Category, Product, ProductImage],
        // Auto-create tables (True for Dev, False for Prod)
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),

    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.graphql'),
      sortSchema: true,
      graphiql: true,
    }),

    AuthModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [HealthResolver],
})
export class AppModule {}
