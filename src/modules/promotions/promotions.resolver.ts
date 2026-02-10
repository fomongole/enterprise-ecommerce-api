import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Promotion } from './entities/promotion.entity';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Promotion)
export class PromotionsResolver {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Mutation(() => Promotion)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCoupon(
    @Args('code') code: string,
    @Args('discountPercentage', { type: () => Int }) discountPercentage: number,
  ) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return this.promotionsService.create(code, discountPercentage, expiryDate);
  }
}
