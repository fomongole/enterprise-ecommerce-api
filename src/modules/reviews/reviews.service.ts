import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: string, input: CreateReviewInput): Promise<Review> {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // 1. Fetch the User object first
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2. Create the review
    const review = this.reviewRepo.create({
      userId,
      ...input,
    });

    // 3. Save it
    const savedReview = await this.reviewRepo.save(review);

    // 4. Manually attach the user so GraphQL can read "firstName"
    savedReview.user = user;

    return savedReview;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { productId },
      relations: ['user'], // Load the author so we can see who wrote it
      order: { createdAt: 'DESC' },
    });
  }
}

//TODO: This logic is simple BUT Later, we SHALL add a check to ensure the user actually bought the product!)
