import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { NotFoundException } from '@nestjs/common';

// A simple return type for the mock
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class PaymentIntentResponse {
  @Field()
  clientSecret: string;
  @Field()
  id: string;
}

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService, // Needed to verify order exists
  ) {}

  @Mutation(() => PaymentIntentResponse)
  async createPaymentIntent(@Args('orderId') orderId: string) {
    // 1. Get the real order to check the amount
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');

    // 2. Create the (mock) payment intent
    return this.paymentsService.createPaymentIntent(
      order.id,
      order.totalAmount,
    );
  }

  // TEST ONLY: A mutation to manually force an order to "PAID"
  // (a Stripe Webhook does this, but we simulate it here)
  @Mutation(() => Boolean)
  async mockPaymentSuccess(@Args('orderId') orderId: string) {
    return this.ordersService.markAsPaid(orderId);
  }
}
