import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "@prisma/client";
import { PaginationDto } from "common/dto/paginationDto";
import { OrderStateList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto{
    @IsOptional()
    @IsEnum( OrderStateList , {
        message: "Valid status list are " + OrderStateList
    })
    status: OrderStatus;

}