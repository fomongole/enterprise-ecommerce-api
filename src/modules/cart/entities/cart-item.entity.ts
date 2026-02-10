import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
import { Cart } from './cart.entity';

@ObjectType()
@Entity('cart_items')
// Ensure a cart cannot have duplicate rows for the same product
@Unique(['cartId', 'productId'])
export class CartItem extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int' })
  quantity: number;

  // --- Calculated Field (Not in DB) ---
  // GraphQL will calculate this on the fly: Price * Quantity
  @Field(() => Float)
  get subTotal(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  // --- Relations ---
  @Field()
  @Column()
  cartId: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Field()
  @Column()
  productId: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
