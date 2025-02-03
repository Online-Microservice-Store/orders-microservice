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

    async create(createInvoiceDto: CreateInvoiceDto) {
        try {
            // 1. Confirmar los IDs de los productos
            const productIds = createInvoiceDto.invoiceStores.flatMap(storeInvoice =>
                storeInvoice.items.map(item => item.productId),
            );
    
            const products: any[] = await firstValueFrom(
                this.client.send({ cmd: 'validate_products' }, productIds),
            );
    
            // Crear un mapa para acceder más rápido a los precios
            const productPriceMap = new Map(products.map(product => [product.id, product.price]));
    
            // 2. Calcular los valores por cada storeInvoice
            const invoiceStoresData = createInvoiceDto.invoiceStores.map(storeInvoice => {
                const subtotal = storeInvoice.items.reduce((acc, item) => {
                    const price = productPriceMap.get(item.productId);
                    if (!price) throw new Error(`Producto con ID ${item.productId} no encontrado.`);
                    return acc + price * item.amount;
                }, 0);
    
                const total = (subtotal - subtotal * (storeInvoice.discount / 100)) * (1 + storeInvoice.tax / 100);
    
                return {
                    date: storeInvoice.date,
                    discount: storeInvoice.discount,
                    tax: storeInvoice.tax,
                    storeId: storeInvoice.storeId,
                    subtotal,
                    total,
                    items: storeInvoice.items.map(item => ({
                        productId: item.productId,
                        amount: item.amount,
                        individualValue: productPriceMap.get(item.productId),
                        totalValue: item.amount * productPriceMap.get(item.productId),
                    })),
                };
            });
    
            // 3. Calcular la cantidad total del invoice
            const totalSubtotal = invoiceStoresData.reduce((acc, store) => acc + store.total, 0);
            const totalInvoice = (totalSubtotal - totalSubtotal * (createInvoiceDto.discount / 100)) * (1 + createInvoiceDto.tax / 100);
    
            // 4. Crear la invoice en la base de datos
            const invoice = await this.invoice.create({
                data: {
                    date: new Date(),
                    clientId: createInvoiceDto.clientId,
                    tax: createInvoiceDto.tax,
                    discount: createInvoiceDto.discount,
                    subtotal: totalSubtotal,
                    total: totalInvoice,
                    InvoiceStore: {
                        create: invoiceStoresData.map(storeInvoice => ({
                            date: storeInvoice.date,
                            discount: storeInvoice.discount,
                            tax: storeInvoice.tax,
                            storeId: storeInvoice.storeId,
                            subtotal: storeInvoice.subtotal,
                            total: storeInvoice.total,
                            Item: {
                                create: storeInvoice.items,
                            },
                        })),
                    },
                    Order: {
                        create: createInvoiceDto.orders.map(order => ({
                            address: order.address,
                            coordinate: order.coordinate,
                            deliveryTime: order.deliveryTime,
                            orderState: order.status,
                            clientId: order.clientId,
                        })),
                    },
                },
                include: {
                    InvoiceStore: {
                        include: {
                            Item: true,
                        },
                    },
                    Order: true,
                },
            });

            // Actualziación de stock
            await Promise.all(
                createInvoiceDto.invoiceStores.map(async (invoiceStore) => {
                    const res = invoiceStore.items.map(async (item) => {
                        const response = await firstValueFrom(
                            this.client.send('update_stock_quantity', {
                                id: item.stockId,
                                amount: item.amount
                            }),
                        );
                        return response;
                    });
                    return res;
                })
            )
            //registro de clientes
            await Promise.all(
                invoiceStoresData.map(async (storeInvoice) => {
                    const response = await firstValueFrom(
                        this.client.send('create_store_client', {
                            clientId: createInvoiceDto.clientId,
                            storeId: storeInvoice.storeId,
                        }),
                    );
                    return response; // Devuelve el resultado para que esté en el array final
                })
            );
            
            return invoice;
        } catch (error) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: error.message || 'Error al crear la invoice',
            });
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
            items: order.InvoiceStore.flatMap(invoiceStore =>
                invoiceStore.Item.map(item => ({
                  productId: item.productId, // Asegúrate de que el campo `name` exista en tu JSON.
                  price: item.individualValue,
                  quantity: item.amount
                }))
              ),
            clientId: order.clientId,
          })
        )
        return paymentSession;
    }

    async getInvoicesByUserId(invoicePaginationDto: InvoicePaginationDto){
        const totalPages = await this.invoice.count(
            {
                where: {clientId: invoicePaginationDto.id},
            }
        );
        const currentPage = invoicePaginationDto.page;
        const perPage = invoicePaginationDto.limit;
        return {
          data: await this.invoice.findMany({
            where: {clientId: invoicePaginationDto.id},
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

    async getInvoicesStoreByUserId(invoicePaginationDto: InvoicePaginationDto){
        const totalPages = await this.invoiceStore.count(
            {
                where: {invoiceId: invoicePaginationDto.invoiceId},
            }
        );
        const currentPage = invoicePaginationDto.page;
        const perPage = invoicePaginationDto.limit;
        
        return {
          data: await this.invoiceStore.findMany({
            where: {invoiceId: invoicePaginationDto.invoiceId},
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

    async getInvoicesByStoreId(invoicePaginationDto: InvoicePaginationDto){
        console.log(invoicePaginationDto)
        const totalPages = await this.invoiceStore.count(
            {
                where: {storeId: invoicePaginationDto.id},
            }
        );
        const currentPage = invoicePaginationDto.page;
        const perPage = invoicePaginationDto.limit;
        
        return {
          data: await this.invoiceStore.findMany({
            where: {storeId: invoicePaginationDto.id},
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

    
}
