import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // DataSource is needed for Transactions
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private cartService: CartService,
    private productsService: ProductsService,
    private dataSource: DataSource, // <--- Key for Transactions
  ) {}

  async checkout(userId: string, input: CreateOrderInput): Promise<Order> {
    // 1. Get the Cart
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // 2. Start a Database Transaction
    // This ensures everything happens or NOTHING happens
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 3. Create the Order Object
      const order = this.orderRepo.create({
        userId,
        status: OrderStatus.PENDING,
        shippingAddress: input.shippingAddress,
        totalAmount: cart.grandTotal, // Use the total calculated in the Cart entity
        items: [],
      });

      // 4. Move Items from Cart to Order
      for (const cartItem of cart.items) {
        // A. Create immutable Order Item (Snapshot)
        const orderItem = new OrderItem();
        orderItem.productName = cartItem.product.name;
        orderItem.price = cartItem.product.price; // FREEZE the price here
        orderItem.quantity = cartItem.quantity;
        orderItem.productId = cartItem.productId;

        // B. Add to order
        order.items.push(orderItem);

        // C. Reduce Stock
        await this.productsService.decreaseStock(
          cartItem.productId,
          cartItem.quantity,
        );
      }

      // 5. Save Order (Cascade will save OrderItems too)
      const savedOrder = await queryRunner.manager.save(Order, order);

      // 6. Clear the User's Cart
      await this.cartService.clearCart(userId);

      // 7. Commit Transaction
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      // 8. Rollback if anything goes wrong
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Helper to find one order
  async findOne(id: string): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { id } });
  }

  // This is what happens when Payment Succeeds!
  async markAsPaid(id: string): Promise<boolean> {
    const order = await this.findOne(id);
    if (!order) return false;

    // Update status to PAID and set a fake payment ID
    order.status = OrderStatus.PAID;
    order.stripePaymentId = `pi_mock_${Date.now()}`;

    await this.orderRepo.save(order);
    return true;
  }
}

/*
This method does the heavy lifting:
  Gets the user's cart.
  Checks if it's empty.
  Transfers items from Cart to Order (Snapshotting price).
  Reduces Stock.
  Clears the Cart.
* */
