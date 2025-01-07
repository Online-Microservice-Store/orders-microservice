import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { ChangeOrderStatus, CreateOrderDto, OrderPaginationDto } from './dto';

@Injectable()
export class Orders2Service extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Orders2Service');
    constructor(
        @Inject(NATS_SERVICE) private readonly productsClient : ClientProxy,
    ){
        super();
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database conected');
    }

    async create( createOrderDto: CreateOrderDto){
        try {
            const newOrder = await this.order2.create({
                data: {
                    address: createOrderDto.address,
                    coordinate: createOrderDto.coordinate,
                    deliveryTime: createOrderDto.deliveryTime,
                    orderState: createOrderDto.status,
                    clientId: createOrderDto.clientId 
                }
            });
            return{
                ...newOrder
            }
        } catch (error) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Check logs' 
            });
        }
    }

    async findAll(orderPaginationDto: OrderPaginationDto) {
        const totalPages = await this.order2.count();
        const currentPage = orderPaginationDto.page;
        const perPage = orderPaginationDto.limit;
        return {
          data: await this.order2.findMany({
            skip: (currentPage - 1) * perPage,
            take: perPage,
          }),
          meta: {
            total: totalPages,
            page: currentPage,
            lastPage: Math.ceil(totalPages / perPage)
          }
        }
    }

    async findOne(id: string) {
        const order = await this.order2.findFirst({
          where: {id},
        });

        if(!order){
          throw new RpcException({
            message: `Order with id ${id} not found`,
            status: HttpStatus.NOT_FOUND
          });
        }

        return order;
    }

    async changeStatus(changeOrderStatus: ChangeOrderStatus){
        const {id, status} = changeOrderStatus;
    
        const order = await this.findOne(id);
        if(!order){
            throw new RpcException({
              message: `Order with id ${id} not found`,
              status: HttpStatus.NOT_FOUND
            });
        }
        return this.order2.update({
          where: {id},
          data: {
            orderState : status
          }
        });
    }
    
}
