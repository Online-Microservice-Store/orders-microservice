import { OrderState } from "@prisma/client";

export const OrderStateList = [
    OrderState.DELIVERED,
    OrderState.NOT_DELIVERED,
    OrderState.RETURNED
]