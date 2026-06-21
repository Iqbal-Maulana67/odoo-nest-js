import { IsNumber, IsOptional, IsString } from "class-validator";

export class createProductDto {
  @IsString()
  name: string;

  @IsNumber()
  list_price: number;
  
  @IsString()
  @IsOptional()
  default_code?: string;

  @IsNumber()
  qty_available: number;

  @IsString()
  type: string;
}