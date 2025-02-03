import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator"

export class CreateItemDto {
    @IsString()
    productId: string;
    
    @IsNumber()
    @Min(0)
    amount: number;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    individualValue?: number;
    
    @IsOptional()
    @IsNumber()
    totalValue?: number;

    @IsString()
    stockId: string;

    @IsString()
    storeId: string;
}