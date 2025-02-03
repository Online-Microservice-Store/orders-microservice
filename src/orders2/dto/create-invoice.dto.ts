import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsPositive, IsString, Min, ValidateNested } from "class-validator"
import { CreateOrderDto } from "./create-order.dto"
import { CreateItemDto } from "./create-item.dto"

export class InvoiceDto {
    @IsDate()
    date: Date

    @IsNumber()
    @Min(0)
    tax: number

    @IsNumber()
    discount: number

    @IsNumber()
    @Min(0)
    subtotal: number

    @IsNumber()
    @Min(0)
    total: number

    @IsArray()
    @ArrayMinSize(1)
    //Valida cada item
    @ValidateNested({each: true})
    @Type( () => CreateItemDto)
    items: []

    @IsArray()
    @ArrayMinSize(1)
    //Valida cada item
    @ValidateNested({each: true})
    @Type( () => CreateOrderDto)
    orders: []

    @IsString()
    clientId: String

    @IsString()
    paymentId: String
}