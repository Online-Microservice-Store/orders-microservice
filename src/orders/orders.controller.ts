import { Controller, NotImplementedException, ParseUUIDPipe, Query } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ChangeOrderStatus, OrderPaginationDto, PaidOrderDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSession = await this.ordersService.createPaymentSession(order);
    return {
      order,
      paymentSession
    }
  }

  @MessagePattern('find_all_orders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('find_one_order')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('change_order_status')
  changeOrderStatus(@Payload() changeOrderStatus: ChangeOrderStatus ){
    return this.ordersService.changeStatus(changeOrderStatus);
  }

  @MessagePattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto){
    return this.ordersService.paidOrder(paidOrderDto);
  }
  
}
