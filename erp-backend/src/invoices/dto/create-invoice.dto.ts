import {
  ArrayMinSize,
  IsArray,
  isArray,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InvoiceItemDto } from './invoice-item.dto';
import { Type } from 'class-transformer';

export class createInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  partner_id: number;

  @IsString()
  @IsOptional()
  invoice_date: string;

  @IsString()
  @IsOptional()
  invoice_date_due: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsString()
  @IsOptional()
  notes: string;
}
