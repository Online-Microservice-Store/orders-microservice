import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"
import { CreateOrderDto } from "./create-order.dto"
import { CreateItemDto } from "./create-item.dto"

export class InvoiceDto {
    @IsDate()
    date: Date

    @IsNumber()
    @IsPositive()
    tax: number

    @IsNumber()
    discount: number

    @IsNumber()
    @IsPositive()
    subtotal: number

    @IsNumber()
    @IsPositive()
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