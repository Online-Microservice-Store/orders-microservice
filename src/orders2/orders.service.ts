import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { ChangeOrderStatus, CreateOrderDto, OrderPaginationDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('OrdersService');
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
            const newOrder = await this.order.create({
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
        const totalPages = await this.order.count();
        const currentPage = orderPaginationDto.page;
        const perPage = orderPaginationDto.limit;
        return {
          data: await this.order.findMany({
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
        const order = await this.order.findFirst({
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
        return this.order.update({
          where: {id},
          data: {
            orderState : status
          }
        });
    }

    async getOrdersByUserId(orderPaginationDto: OrderPaginationDto){
      const totalPages = await this.order.count({
        where: {clientId: orderPaginationDto.id},
      });
        const currentPage = orderPaginationDto.page;
        const perPage = orderPaginationDto.limit;
        return {
          data: await this.order.findMany({
            where: {clientId: orderPaginationDto.id},
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

    async getOrdersByStoreId(orderPaginationDto: OrderPaginationDto){
      const { page, limit } = orderPaginationDto;

      const storeInvoices = await this.invoiceStore.findMany({
          where: {
              storeId: orderPaginationDto.id
          },
          include: {
              Invoice: {
                  include: {
                      Order: true
                  }
              },
          }
      });

      const orders = storeInvoices.flatMap((invoiceStore) =>
          invoiceStore.Invoice?.Order || []
        );
      // Calcular la cantidad total de órdenes
      const totalOrders = orders.length;
    
      // Calcular las páginas
      const currentPage = orderPaginationDto.page;
      const perPage = orderPaginationDto.limit;
      const offset = (page - 1) * limit;

      // Obtener solo las órdenes de la página actual
      const paginatedOrders = orders.slice(offset, offset + limit);
          
        return {
          data: paginatedOrders, // Devuelve las órdenes directamente
          meta: {
            total: totalOrders,
            page: currentPage,
            lastPage: Math.ceil(totalOrders / perPage)
          }
        };

  }
    
}
