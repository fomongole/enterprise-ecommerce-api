import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';

@ObjectType()
@Entity('products')
export class Product extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field()
  @Column({ unique: true })
  sku: string;

  // Decimal is crucial for money. Float causes math errors.
  // precision: 10 (total digits), scale: 2 (decimal places) -> 99999999.99
  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column('int', { default: 0 })
  stock: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  // --- Relations ---

  @Field(() => String)
  @Column()
  categoryId: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Field(() => [ProductImage], { nullable: true })
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true }) // Cascade allows saving images WITH product
  images?: ProductImage[];
}
