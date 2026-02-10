import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  async checkout(
    @Args('input') input: CreateOrderInput,
    @Args('userId') userId: string, // Temporary until AuthGuard is fully linked
  ) {
    return this.ordersService.checkout(userId, input);
  }

  @Query(() => [Order], { name: 'myOrders' })
  async getMyOrders(@Args('userId') userId: string) {
    return this.ordersService.getMyOrders(userId);
  }
}
