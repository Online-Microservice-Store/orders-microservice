import { IsEnum, IsUUID } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "@prisma/client";

export class ChangeOrderStatus{
    @IsUUID()
    id: string;

    @IsEnum(OrderStatusList, {
        message: "Valid status are " + OrderStatusList
    })
    status: OrderStatus
}