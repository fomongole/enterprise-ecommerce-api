import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@ObjectType()
@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Field(() => String)
  @Column()
  productName: string; // Snapshot name in case product is deleted

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Snapshot price at moment of purchase

  @Field(() => Int)
  @Column('int')
  quantity: number;

  // --- Relations ---

  @Field(() => String)
  @Column()
  orderId: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  productId?: string;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product?: Product;
}
