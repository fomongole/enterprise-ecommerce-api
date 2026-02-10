import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Mutation(() => Review)
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Args('input') input: CreateReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.create(user.id, input);
  }

  // Public access
  @Query(() => [Review], { name: 'productReviews' })
  async getProductReviews(@Args('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }
}
