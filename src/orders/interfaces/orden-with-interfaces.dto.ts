import { OrderStatus } from "@prisma/client";

export interface OrdersWithProducts{
    OrderItem: {
        name: string,
        productId: string,
        quantity: number,
        price: number
    }[];
    id: string;
    totalAmount: number;
    totalItems: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}