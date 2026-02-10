import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { slug: input.slug },
    });
    if (existing) throw new ConflictException('Slug already exists');

    const category = this.categoryRepo.create(input);
    return this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { id } });
  }
}
