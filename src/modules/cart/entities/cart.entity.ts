import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@ObjectType()
@Entity('carts')
export class Cart extends BaseEntity {
  // --- Guest Support ---
  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  couponCode?: string | null; // <--- string (e.g., "SAVE20"), undefined (not set), or null (explicitly cleared in the database)"

  @Field(() => Int, { defaultValue: 0 })
  @Column('int', { default: 0 })
  discountPercentage: number; // Store the % applied

  // --- Grand Total Calculation ---
  @Field(() => Float)
  get grandTotal(): number {
    if (!this.items) return 0;

    // 1. Calculate Subtotal
    const subTotal = this.items.reduce(
      (total, item) => total + item.subTotal,
      0,
    );

    // 2. Apply Discount
    if (this.discountPercentage > 0) {
      const discountAmount = (subTotal * this.discountPercentage) / 100;
      return parseFloat((subTotal - discountAmount).toFixed(2));
    }

    return subTotal;
  }
}
