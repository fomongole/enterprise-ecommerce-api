import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  productId: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;
}
