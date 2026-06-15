import { SaleStatus } from '../entities/sale.entity';
import { IsString, IsNumber, MinLength, IsArray, IsEnum } from 'class-validator';

export class UpdateSaleDto {
  @IsString()
  notes?: string;
  status?: SaleStatus;
}