import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ConfigModule, OrdersModule],
  providers: [PaymentsService, PaymentsResolver],
  exports: [PaymentsService],
})
export class PaymentsModule {}
