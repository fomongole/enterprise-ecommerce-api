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
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private categoriesService: CategoriesService,
    private auditService: AuditService,
  ) {}

  async create(input: CreateProductInput, user: User): Promise<Product> {
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

    // 4. LOG THE ACTION
    await this.auditService.log(
      user,
      'CREATE_PRODUCT',
      savedProduct.id,
      `Created product: ${savedProduct.name} (${savedProduct.sku})`,
    );

    // Manually attach the category object to the result
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

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    if (product.stock < quantity) {
      throw new ConflictException(`Not enough stock for ${product.name}`);
    }

    product.stock -= quantity;
    await this.productRepo.save(product);
  }
}
