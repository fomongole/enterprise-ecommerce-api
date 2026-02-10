import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('categories')
export class Category extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  // --- Self-Referencing Relation (Parent Category) ---
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  parentId?: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // --- Relations ---
  // We will uncomment this once we create the Product entity
  // @Field(() => [Product], { nullable: true })
  // @OneToMany(() => Product, (product) => product.category)
  // products?: Product[];
}
