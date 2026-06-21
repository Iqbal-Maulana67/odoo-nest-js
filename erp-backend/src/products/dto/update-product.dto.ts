import { IsNumber, IsOptional, IsString } from "class-validator";

export class updateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  list_price: number;
  
  @IsString()
  @IsOptional()
  default_code?: string;

  @IsNumber()
  @IsOptional()
  qty_available: number;

  @IsString()
  @IsOptional()
  type: string;
}