import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { AddToCartInput } from './dto/add-to-cart.input';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    private productsService: ProductsService,
    private promotionsService: PromotionsService,
  ) {}

  // 1. Get or Create Cart for a User
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { userId },
      relations: ['items', 'items.product'], // Load items to calc totals
    });

    if (!cart) {
      cart = this.cartRepo.create({ userId, items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  // 2. Add Item to Cart
  async addToCart(userId: string, input: AddToCartInput): Promise<Cart> {
    // A. Validate Product & Stock
    const product = await this.productsService.findOne(input.productId);
    if (!product) throw new NotFoundException('Product not found');

    if (product.stock < input.quantity) {
      throw new BadRequestException(
        `Not enough stock. Only ${product.stock} left.`,
      );
    }

    // B. Get Cart
    const cart = await this.getOrCreateCart(userId);

    // C. Check if item exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === input.productId,
    );

    if (existingItem) {
      // Update Quantity
      existingItem.quantity += input.quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      // Create New Item
      const newItem = this.cartItemRepo.create({
        cartId: cart.id,
        productId: input.productId,
        quantity: input.quantity,
      });
      await this.cartItemRepo.save(newItem);
    }

    // D. Return updated cart
    return this.getOrCreateCart(userId);
  }

  // 3. Clear Cart (After checkout)
  async clearCart(userId: string): Promise<boolean> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepo.delete({ cartId: cart.id });
    return true;
  }

  async applyCoupon(userId: string, code: string): Promise<Cart> {
    // 1. Validate the code
    const promotion = await this.promotionsService.validateCode(code);

    // 2. Get the cart
    const cart = await this.getOrCreateCart(userId);

    // 3. Apply discount
    cart.couponCode = promotion.code;
    cart.discountPercentage = promotion.discountPercentage;

    // 4. Save and return
    return this.cartRepo.save(cart);
  }

  // OPTIONAL: Method to remove coupon
  async removeCoupon(userId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    cart.couponCode = null;
    cart.discountPercentage = 0;
    return this.cartRepo.save(cart);
  }
}
