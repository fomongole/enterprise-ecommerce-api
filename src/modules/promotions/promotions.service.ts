import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepo: Repository<Promotion>,
    private auditService: AuditService,
  ) {}

  async create(
    code: string,
    discountPercentage: number,
    expiryDate: Date,
    user: User,
  ): Promise<Promotion> {
    const promotion = this.promotionRepo.create({
      code,
      discountPercentage,
      expiryDate,
    });

    const savedPromotion = await this.promotionRepo.save(promotion);

    // LOG THE ACTION
    await this.auditService.log(
      user,
      'CREATE_PROMOTION',
      savedPromotion.id,
      `Created coupon: ${code} (${discountPercentage}% OFF)`,
    );

    return savedPromotion;
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
