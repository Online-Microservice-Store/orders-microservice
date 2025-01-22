import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "common/dto/paginationDto";

export class InvoicePaginationDto extends PaginationDto {
    @IsOptional()
    @IsString()
    id?:string;

    @IsOptional()
    @IsString()
    invoiceId?:string;
}