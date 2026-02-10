import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { PromotionsService } from './promotions.service';
import { Promotion } from './entities/promotion.entity';

@Resolver(() => Promotion)
export class PromotionsResolver {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Mutation(() => Promotion)
  async createCoupon(
    @Args('code') code: string,
    @Args('discountPercentage', { type: () => Int }) discountPercentage: number,
  ) {
    // Set expiry to 30 days from now for simplicity
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    return this.promotionsService.create(code, discountPercentage, expiryDate);
  }
}
