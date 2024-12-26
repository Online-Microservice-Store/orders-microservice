import { IsDate, IsEnum, IsString, ValidateNested } from "class-validator";
import { OrderStateList } from "../enum/order.enum";
import { OrderState } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsString()
    address: string;

    @IsString()
    coordinate: string

    @Type(() => Date)
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

