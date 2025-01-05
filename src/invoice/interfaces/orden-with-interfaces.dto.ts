import { OrderState } from "@prisma/client";

export interface InvoiceWithProducts{
    Item: {
        productId: string,
        individualValue: number,
        amount: number,
        name: string
    }[];
    Order2: {
        address: string,
        coordinate: string,
        deliveryTime: Date,
        orderState: OrderState
    }[]
    id: string;
    date: Date;
    tax: number;
    discount: number;
    subtotal: number;
    total: number;
    
    // status: OrderStatus;
    // paid: boolean;
    // paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}