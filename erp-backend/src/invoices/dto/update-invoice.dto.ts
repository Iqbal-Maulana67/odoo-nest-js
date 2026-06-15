import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { InvoiceItemDto } from './invoice-item.dto';
import { Type } from 'class-transformer';

export class updateInvoiceDto {
  @IsNumber()
  @IsOptional()
  partner_id: number;

  @IsString()
  @IsOptional()
  invoice_date: string;

  @IsString()
  @IsOptional()
  invoice_date_due: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @IsOptional()
  items: InvoiceItemDto[];

  @IsString()
  @IsOptional()
  notes: string;
}
