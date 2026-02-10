import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productsService.create(input);
  }

  @Query(() => [Product], { name: 'products' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id') id: string) {
    return this.productsService.findOne(id);
  }
}
