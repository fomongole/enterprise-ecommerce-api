import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Query(() => [Category], { name: 'categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }
}
