import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports:[
    NatsModule
  ]
})
export class InvoiceModule {}
