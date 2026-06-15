import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class updateCustomerDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  mobile: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  vat: string;

  @IsNumber()
  @IsOptional()
  country_id: number;

  @IsBoolean()
  @IsOptional()
  is_company: boolean;
}
