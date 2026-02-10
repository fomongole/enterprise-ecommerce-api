import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  async create(input: CreateProductInput): Promise<Product> {
    // 1. Validate Category Exists
    const category = await this.categoriesService.findOne(input.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    // 2. Check for Duplicate SKU or Slug
    const existing = await this.productRepo.findOne({
      where: [{ slug: input.slug }, { sku: input.sku }],
    });
    if (existing)
      throw new ConflictException(
        'Product with this slug or SKU already exists',
      );

    // 3. Create & Save
    const product = this.productRepo.create(input);
    const savedProduct = await this.productRepo.save(product);

    // Manually attach the category object to the result
    // so GraphQL can resolve the "category" field immediately.
    savedProduct.category = category;

    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }
}
