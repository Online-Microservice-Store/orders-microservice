import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto, InvoicePaginationDto, UpdateInvoiceDto } from './dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern('create_invoice')
  async create(@Payload() createInvoiceDto: CreateInvoiceDto) {
    const order = await this.invoiceService.create(createInvoiceDto);
    const paymentSession = await this.invoiceService.createPaymentSession(order);
    return {
      order,
      paymentSession
    }
  }

  @MessagePattern('find_all_invoices')
  findAll(@Payload() invoicePaginationDto: InvoicePaginationDto) {
    return this.invoiceService.findAll(invoicePaginationDto);
  }

  @MessagePattern('find_one_invoice')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.invoiceService.findOne(id);
  }

  @MessagePattern('edit_one_invoice')
  editInvoice(@Payload() updateInvoiceDto : UpdateInvoiceDto){
    return this.invoiceService.editInvoice(updateInvoiceDto);
  }
  
}
