import { Module } from '@nestjs/common';
import { NatsModule } from './nats/nats.module';
import { OrdersModule } from './orders2/orders.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [ NatsModule, OrdersModule, InvoiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
