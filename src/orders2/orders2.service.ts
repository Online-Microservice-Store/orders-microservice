import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { CreateOrderDto } from './dto';

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
                    orderState: createOrderDto.status
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
}
