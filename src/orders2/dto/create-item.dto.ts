import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreateItemDto {
    @IsString()
    productId: string;
    
    @IsNumber()
    @IsPositive()
    amount: number;
    
    @IsNumber()
    @IsPositive()
    individualValue: number;
    
    @IsNumber()
    totalValue: number;
}