import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@ObjectType()
@Entity('promotions')
export class Promotion extends BaseEntity {
  @Field()
  @Column({ unique: true })
  code: string; // e.g., "SUMMER2024"

  @Field(() => Int)
  @Column('int')
  discountPercentage: number; // e.g., 20 for 20% off

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column()
  expiryDate: Date;
}
