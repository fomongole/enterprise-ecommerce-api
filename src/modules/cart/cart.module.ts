import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module'; // Needed to check stock
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    PromotionsModule,
  ],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
