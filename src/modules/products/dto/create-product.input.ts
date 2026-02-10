import { InputType, Field, Float, Int } from '@nestjs/graphql';

// a small helper Input for images
@InputType()
export class ProductImageInput {
  @Field()
  url: string;

  @Field({ defaultValue: false })
  isPrimary: boolean;

  @Field({ nullable: true })
  altText?: string;
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  sku: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field()
  categoryId: string;

  @Field(() => [ProductImageInput], { nullable: true })
  images?: ProductImageInput[];
}
