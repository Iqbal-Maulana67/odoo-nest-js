import { IsString, IsNumber, MinLength, IsArray } from 'class-validator';

export class CreateSaleItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

export class CreateSaleDto {
  @IsNumber()
  customerId: number;
  
  @IsArray()
  items: CreateSaleItemDto[];

  @IsString()
  notes?: string;
}