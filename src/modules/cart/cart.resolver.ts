import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { AddToCartInput } from './dto/add-to-cart.input';
// We'll use a simple guard to simulate getting the userId for now
// In real life, we use @CurrentUser() decorator

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async addToCart(
    @Args('input') input: AddToCartInput,
    // For now, we manually pass userId until we hook up Auth Guard
    @Args('userId') userId: string,
  ) {
    return this.cartService.addToCart(userId, input);
  }

  @Query(() => Cart, { name: 'myCart' })
  async getCart(@Args('userId') userId: string) {
    return this.cartService.getOrCreateCart(userId);
  }
}
