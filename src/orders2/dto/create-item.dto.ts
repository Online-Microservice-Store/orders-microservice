import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreateItemDto {
    @IsString()
    productId: string;
    
    @IsNumber()
    @IsPositive()
    amount: number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    individualValue?: number;
    
    @IsOptional()
    @IsNumber()
    totalValue?: number;

    @IsString()
    stockId: string;

    @IsString()
    storeId: string;
}