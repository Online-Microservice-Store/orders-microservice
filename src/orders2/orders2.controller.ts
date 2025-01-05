import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { Orders2Service } from './orders2.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatus, CreateOrderDto, OrderPaginationDto, PaidOrderDto } from './dto';

@Controller('orders2')
export class Orders2Controller {
  constructor(private readonly orders2Service: Orders2Service) {}

  @MessagePattern('create_order2')
  async create(@Payload() createOrderDto : CreateOrderDto){
    const order = await this.orders2Service.create(createOrderDto);
    return order;
  }

  @MessagePattern('find_all_orders2')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.orders2Service.findAll(orderPaginationDto);
  } 
  @MessagePattern('find_one_order2')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.orders2Service.findOne(id);
  }
  
  @MessagePattern('change_order2_status')
  changeOrderStatus(@Payload() changeOrderStatus: ChangeOrderStatus ){
    return this.orders2Service.changeStatus(changeOrderStatus);
  }
  
}
