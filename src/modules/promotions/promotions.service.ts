import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepo: Repository<Promotion>,
  ) {}

  async create(
    code: string,
    discountPercentage: number,
    expiryDate: Date,
  ): Promise<Promotion> {
    const promotion = this.promotionRepo.create({
      code,
      discountPercentage,
      expiryDate,
    });
    return this.promotionRepo.save(promotion);
  }

  async validateCode(code: string): Promise<Promotion> {
    const promotion = await this.promotionRepo.findOne({ where: { code } });

    if (!promotion) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (!promotion.isActive) {
      throw new BadRequestException('This coupon is no longer active');
    }

    if (new Date() > promotion.expiryDate) {
      throw new BadRequestException('This coupon has expired');
    }

    return promotion;
  }
}
