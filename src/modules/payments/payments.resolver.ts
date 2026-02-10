import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { ObjectType, Field } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ObjectType()
class PaymentIntentResponse {
  @Field()
  clientSecret: string;
  @Field()
  id: string;
}

@Resolver()
@UseGuards(JwtAuthGuard)
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Mutation(() => PaymentIntentResponse)
  async createPaymentIntent(
    @Args('orderId') orderId: string,
    @CurrentUser() user: User,
  ) {
    // 1. Get the real order
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');

    // 2. SECURITY CHECK
    if (order.userId !== user.id) {
      throw new ForbiddenException('You can only pay for your own orders');
    }

    // 3. Create the payment intent
    return this.paymentsService.createPaymentIntent(
      order.id,
      order.totalAmount,
    );
  }

  // TEST ONLY: Locked to ADMINS only!
  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async mockPaymentSuccess(@Args('orderId') orderId: string) {
    return this.ordersService.markAsPaid(orderId);
  }
}
