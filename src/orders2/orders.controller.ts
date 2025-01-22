import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatus, CreateOrderDto, OrderPaginationDto, PaidOrderDto } from './dto';

@Controller('orders')
export class OrdersController {
  
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  async create(@Payload() createOrderDto : CreateOrderDto){
    const order = await this.ordersService.create(createOrderDto);
    return order;
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
  //Client
  @MessagePattern('find_orders_by_clientId')
  getOrdersByUser(@Payload() orderPaginationDto: OrderPaginationDto){
    return this.ordersService.getOrdersByUserId(orderPaginationDto);
  }

  @MessagePattern('find_orders_by_storeId')
  getOrdersByStoreId(@Payload() invoicePaginationDto : OrderPaginationDto){
    return this.ordersService.getOrdersByStoreId(invoicePaginationDto);
  }
  
}
