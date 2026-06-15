import { IsNumber, IsString } from "class-validator";

export class InvoiceItemDto {

  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price_unit: number;

  @IsString()
  name: string;

}