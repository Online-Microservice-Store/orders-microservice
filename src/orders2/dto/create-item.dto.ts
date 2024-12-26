import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreateItemDto {
    @IsNumber()
    @IsPositive()
    productId: number;
    
    @IsNumber()
    @IsPositive()
    amount: number;
    
    @IsNumber()
    @IsPositive()
    individualValue: number;
    
    @IsNumber()
    totalValue: number;
}