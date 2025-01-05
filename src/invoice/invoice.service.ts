import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateInvoiceDto, InvoicePaginationDto, UpdateInvoiceDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InvoiceWithProducts } from './interfaces/orden-with-interfaces.dto';
import { PaginationDto } from 'common/dto/paginationDto';

@Injectable()
export class InvoiceService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('Invoice service');
    constructor(
        @Inject(NATS_SERVICE) private readonly client : ClientProxy,
    ){
        super();
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Database connected');
    }

    async create(createInvoiceDto: CreateInvoiceDto){
        try {
            //1 Confirmar los ids de los productos
            const productIds = createInvoiceDto.items.map(
                (item) => item.productId
            );
            const products: any[] = await firstValueFrom(
                this.client.send({cmd: 'validate_products'}, productIds)
            )
            //2 Calcular los valores
            const totalAmount = createInvoiceDto.items.reduce( (acc, orderItem) => {
                const price = products.find(
                    (product) => product.id === orderItem.productId
                ).price

                //return el precio por la cantidad del articulo
                return acc + (price * orderItem.amount);
            }, 0)
            // const totalItems = createInvoiceDto.items.reduce( (acc, item) => {
            //     return acc + item.amount;
            // }, 0);
            
            //Crear la insercion en la base de datos
            const invoice = await this.invoice.create({
                data: {
                    date: new Date(),
                    tax: createInvoiceDto.tax,
                    discount: createInvoiceDto.discount,
                    subtotal: totalAmount,
                    total: (totalAmount - (totalAmount * (createInvoiceDto.discount / 100))) * ((createInvoiceDto.tax/100) + 1),
                    Item: {
                        createMany: {
                            data: createInvoiceDto.items.map( (item) => ({
                                amount: item.amount,
                                productId: item.productId,
                                individualValue: products.find( product => product.id == item.productId).price,
                                totalValue: item.amount * products.find( product => product.id == item.productId).price
                            }))
                        }
                    },
                    Order2: {
                        createMany: {
                            data: createInvoiceDto.orders.map( (order) => ({
                                address: order.address,
                                coordinate: order.coordinate,
                                deliveryTime: order.deliveryTime,
                                orderState: order.status
                            }))
                        }
                    }
                },
                include: {
                    Item: {
                        select: {
                            productId: true,
                            individualValue: true,
                            amount: true,
                        }
                    },
                    Order2: {
                        select: {
                            address: true,
                            coordinate: true,
                            deliveryTime: true,
                            orderState: true
                        }
                    }
                }
            });

            return {
                ...invoice,
                Item: invoice.Item.map( (item) => ({
                    ...item,
                    name: products.find( product => product.id == item.productId).name
                })),
                Order: invoice.Order2.map( order => ({
                    ...order
                }))
            }
        } catch (error) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Check logs' 
            })
        }
    }

    async findAll(paginationDto: PaginationDto){
        const totalPages = await this.invoice.count();
        const currentPage = paginationDto.page;
        const perPage = paginationDto.limit;
        return {
          data: await this.invoice.findMany({
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

    async findOne(id: string){
        const invoice = await this.invoice.findFirst({
            where: {id},
          });
  
          if(!invoice){
            throw new RpcException({
              message: `Invoice with id ${id} not found`,
              status: HttpStatus.NOT_FOUND
            });
          }
  
          return invoice;
    }
    async editInvoice(updateInvoiceDto : UpdateInvoiceDto){
        
    }
    async createPaymentSession(order: InvoiceWithProducts){
        const paymentSession = await firstValueFrom(
          this.client.send('create.payment.session',{
            orderId: order.id,
            currency: 'usd',
            items: order.Item.map( item => ({
              name: item.name,
              price: item.individualValue,
              quantity: item.amount
            })),
          })
        )
        return paymentSession;
    }
}
