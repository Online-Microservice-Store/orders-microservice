import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateItemDto } from "./create-item.dto";

export class CreateStoreInvoiceDto{
    @Type( () => Date)
    @IsDate()
    date: Date;
    
    @IsNumber()
    discount: number;

    @IsNumber()
    tax: number;

    @IsOptional()
    @IsNumber()
    subtotal?: number;

    @IsOptional()
    @IsNumber()
    total?: number;

    //Relations
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateItemDto)
    items: CreateItemDto[]

    @IsString()
    storeId: string;

}