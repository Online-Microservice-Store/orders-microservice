import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { Orders2Service } from './orders2.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatus, CreateOrderDto, OrderPaginationDto, PaidOrderDto } from './dto';

@Controller('orders2')
export class Orders2Controller {
  constructor(private readonly orders2Service: Orders2Service) {}

  // @MessagePattern('create_order2')
  // async create(@Payload() createOrderDto : CreateOrderDto){
  //   const order = await this.orders2Service.create(createOrderDto);
  //   const paymentSession = await this.orders2Service.createPaymentSession(order);
  //   return {
  //     order,
  //     paymentSession
  //   }
  // }

  // @MessagePattern('find_all_orders2')
  // findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
  //   return this.ordersService.findAll(orderPaginationDto);
  // } 
  // @MessagePattern('find_one_order2')
  // findOne(@Payload('id', ParseUUIDPipe) id: string) {
  //   return this.orders2Service.findOne(id);
  // }
  
  // @MessagePattern('change_order2_status')
  // changeOrderStatus(@Payload() changeOrderStatus: ChangeOrderStatus ){
  //   return this.ordersService.changeStatus(changeOrderStatus);
  // }
  
  // @MessagePattern('payment.succeeded')
  // paidOrder(@Payload() paidOrderDto: PaidOrderDto){
  //   return this.ordersService.paidOrder(paidOrderDto);
  // }
}
