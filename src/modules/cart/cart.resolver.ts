import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { AddToCartInput } from './dto/add-to-cart.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Cart)
@UseGuards(JwtAuthGuard) // <--- Apply to ENTIRE class (Must be logged in to touch cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async addToCart(
    @Args('input') input: AddToCartInput,
    @CurrentUser() user: User,
  ) {
    return this.cartService.addToCart(user.id, input);
  }

  @Query(() => Cart, { name: 'myCart' })
  async getCart(@CurrentUser() user: User) {
    return this.cartService.getOrCreateCart(user.id);
  }

  @Mutation(() => Cart)
  async applyCoupon(@CurrentUser() user: User, @Args('code') code: string) {
    return this.cartService.applyCoupon(user.id, code);
  }
}
