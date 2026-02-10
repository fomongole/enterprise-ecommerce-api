import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

// Register Enum so GraphQL can see it
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @Column({ unique: true })
  email: string;

  // No @Field means this is hidden from GraphQL queries (Security)
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastLogin?: Date;

  @Field(() => Cart, { nullable: true })
  @OneToOne(() => Cart, (cart) => cart.user)
  cart?: Cart;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
