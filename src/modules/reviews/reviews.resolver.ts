import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  async createReview(
    @Args('input') input: CreateReviewInput,
    @Args('userId') userId: string,
  ) {
    return this.reviewsService.create(userId, input);
  }

  @Query(() => [Review], { name: 'productReviews' })
  async getProductReviews(@Args('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }
}
