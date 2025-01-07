import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { CreateItemDto } from "src/orders2/dto";
import { CreateOrderDto } from "./create-order.dto";

export class CreateInvoiceDto {
    @Type( () => Date)
    @IsDate()
    date: Date;
    
    @IsNumber()
    @IsPositive()
    tax: number;

    @IsNumber()
    @IsPositive()
    discount: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    subtotal?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    total?: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateItemDto)
    items: CreateItemDto[]

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateOrderDto)
    orders: CreateOrderDto[]

    @IsString()
    clientId: string;

    @IsString()
    paymentId: string;
}