import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { CreateItemDto } from "src/orders2/dto";
import { CreateOrderDto } from "./create-order.dto";
import { CreateStoreInvoiceDto } from "./create-store-invoice.dto";

export class CreateInvoiceDto {
    @Type( () => Date)
    @IsDate()
    date: Date;
    
    @IsNumber()
    @Min(0)
    tax: number;

    @IsNumber()
    discount: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    subtotal?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    total?: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateStoreInvoiceDto)
    invoiceStores: CreateStoreInvoiceDto[];
    

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateOrderDto)
    orders: CreateOrderDto[]

    @IsString()
    clientId: string;

}