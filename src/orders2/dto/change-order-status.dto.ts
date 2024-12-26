import { IsEnum, IsUUID } from "class-validator";
import { OrderStateList } from "../enum/order.enum";
import { OrderState } from "@prisma/client";

export class ChangeOrderStatus{
    @IsUUID()
    id: string;

    @IsEnum(OrderStateList, {
        message: "Valid status are " + OrderStateList
    })
    status: OrderState;
}