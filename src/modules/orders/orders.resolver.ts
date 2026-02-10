import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Order)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  async checkout(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.checkout(user.id, input);
  }

  @Query(() => [Order], { name: 'myOrders' })
  async getMyOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user.id);
  }
}
