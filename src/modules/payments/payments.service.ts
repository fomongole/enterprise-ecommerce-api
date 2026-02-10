import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private configService: ConfigService) {}

  // MOCK: Simulate creating a payment intent
  async createPaymentIntent(orderId: string, amount: number, currency = 'usd') {
    this.logger.log(
      `Creating MOCK payment intent for Order #${orderId} Amount: ${amount}`,
    );

    // Return a fake Stripe response
    return {
      clientSecret: `mock_secret_${orderId}`,
      id: `pi_mock_${Math.random().toString(36).substring(7)}`, // Random ID like Stripe's
    };
  }
}
