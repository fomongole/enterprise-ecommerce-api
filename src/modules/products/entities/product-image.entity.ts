import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from './product.entity';

@ObjectType()
@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Field()
  @Column()
  url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  altText?: string;

  @Field()
  @Column({ default: false })
  isPrimary: boolean;

  // --- Relation to Product ---
  @Field()
  @Column()
  productId: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
