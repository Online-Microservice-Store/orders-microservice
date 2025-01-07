import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateItemDto{
    @IsString()
    productId: string;
    
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    individualValue?: number;

    @IsNumber()
    @IsPositive()
    totalValue?: number;

    @IsString()
    stockId: string;
}