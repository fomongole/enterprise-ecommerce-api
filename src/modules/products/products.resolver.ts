import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
