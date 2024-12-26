import { IsDate, IsEnum, IsString } from "class-validator";
import { Type } from "class-transformer";
import {OrderStateList} from '../enums/order.enum'
import { OrderState, OrderStatus } from "@prisma/client";
export class CreateOrderDto {
    @IsString()
    address: string;

    @IsString()
    coordinate: string

    @Type(() => Date) // Transforma automáticamente el string a Date
    @IsDate()
    deliveryTime: Date
    
    @IsEnum( OrderStateList, {
        message: "Valid status are " + OrderStateList
    })
    status: OrderState

    // @IsArray()
    // @ArrayMinSize(1)
    // //Valida cada item
    // @ValidateNested({each: true})
    // @Type( () => OrderItemDto)
    // items: OrderItemDto[]
}

