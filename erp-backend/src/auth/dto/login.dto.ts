import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  login: string; // bisa email atau username Odoo

  @IsString()
  @MinLength(1)
  password: string;
}