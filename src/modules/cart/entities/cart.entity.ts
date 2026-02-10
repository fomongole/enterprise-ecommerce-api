import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
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

  // --- Grand Total Calculation ---
  @Field(() => Float)
  get grandTotal(): number {
    if (!this.items) return 0;
    // Sum up the subTotal of all items
    return this.items.reduce((total, item) => total + item.subTotal, 0);
  }
}
