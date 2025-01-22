import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateInvoiceDto, InvoicePaginationDto, UpdateInvoiceDto } from './dto';
import { PaginationDto } from 'common/dto/paginationDto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern('create_invoice')
  async create(@Payload() createInvoiceDto: CreateInvoiceDto) {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    const paymentSession = await this.invoiceService.createPaymentSession(invoice);
    return {
      order: invoice,
      paymentSession
    }
  }

  @MessagePattern('find_all_invoices')
  findAll(@Payload() paginationDto : PaginationDto) {
    return this.invoiceService.findAll(paginationDto);
  }

  @MessagePattern('find_one_invoice')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.invoiceService.findOne(id);
  }

  @MessagePattern('edit_one_invoice')
  editInvoice(@Payload() updateInvoiceDto : UpdateInvoiceDto){
    return this.invoiceService.editInvoice(updateInvoiceDto);
  }

  //Client
  @MessagePattern('find_invoices_by_clientId')
  getInvoicesByUser(@Payload() invoicePaginationDto: InvoicePaginationDto){
    return this.invoiceService.getInvoicesByUserId(invoicePaginationDto);
  }

  @MessagePattern('find_invoices_by_StoreId')
  getInvoicesByStoreId(@Payload('id') invoicePaginationDto: InvoicePaginationDto){
    return this.invoiceService.getInvoicesByStoreId(invoicePaginationDto);
  }

  //Client
  @MessagePattern('find_invoicesStore_by_clientId')
  getInvoicesStoreByUserId(@Payload() invoicePaginationDto: InvoicePaginationDto){
    return this.invoiceService.getInvoicesStoreByUserId(invoicePaginationDto);
  }
   
}
