import { OrderState } from "@prisma/client";

export interface InvoiceWithProducts {
    id: string;
    date: Date;
    tax: number;
    discount: number;
    subtotal: number;
    total: number;
    clientId: string;
    createdAt: Date;
    updatedAt: Date;
    InvoiceStore: {
        id: string;
        date: Date;
        discount: number;
        tax: number;
        subtotal: number;
        total: number;
        storeId: string;
        invoiceId: string;
        Item: {
            id: string;
            productId: string;
            amount: number;
            individualValue: number;
            totalValue: number;
            createdAt: Date;
            updatedAt: Date;
            invoiceStoreId: string;
        }[];
    }[];
    Order: {
        id: string;
        address: string;
        coordinate: string;
        deliveryTime: Date;
        orderState: OrderState;
        createdAt: Date;
        updatedAt: Date;
        invoiceId: string;
        clientId: string;
    }[];
}
