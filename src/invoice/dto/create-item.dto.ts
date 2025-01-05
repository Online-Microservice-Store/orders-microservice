import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateItemDto{
    @IsString()
    productId: string;
    
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNumber()
    @IsPositive()
    individualValue: number;

    @IsNumber()
    @IsPositive()
    totalValue: number;
}