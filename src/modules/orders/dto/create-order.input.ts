import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  shippingAddress: string; // Simplified for now (e.g., "123 Main St, New York")

  // Later we will add paymentToken here for Stripe
}
