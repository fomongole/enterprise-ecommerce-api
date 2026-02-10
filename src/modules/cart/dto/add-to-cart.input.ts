import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;

  // Optional: For guest carts later
  @Field({ nullable: true })
  userId?: string;
}
