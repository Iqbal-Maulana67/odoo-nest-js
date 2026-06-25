import { SaleStatus } from '../entities/sale.entity';
import { IsString, IsNumber, MinLength, IsArray, IsEnum, IsOptional } from 'class-validator';
import { CreateSaleItemDto } from './create-sale.dto';

export class UpdateSaleDto {
  @IsNumber()
  customerId: Number;
  
  @IsOptional()
  @IsArray()
  items: CreateSaleItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  status?: SaleStatus;
}