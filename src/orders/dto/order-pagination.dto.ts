import { IsEnum, IsOptional } from "class-validator";
import { OrderStatusList } from "../enum/order.enum";
import { OrderStatus } from "@prisma/client";
import { PaginationDto } from "common/dto/paginationDto";

export class OrderPaginationDto extends PaginationDto{
    @IsOptional()
    @IsEnum( OrderStatusList , {
        message: "Valid status list are " + OrderStatusList
    })
    status: OrderStatus;

}