import { IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateItemDto{
    @IsUUID()
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