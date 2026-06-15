import { IsBoolean, isNumber, IsNumber, IsString } from 'class-validator';

export class createCustomerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  mobile: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  vat: string;

  @IsNumber()
  country_id: number;

  @IsBoolean()
  is_company: boolean;

}
