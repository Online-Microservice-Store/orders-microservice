import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './nats/nats.module';
import { Orders2Module } from './orders2/orders2.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [OrdersModule, NatsModule, Orders2Module, InvoiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
