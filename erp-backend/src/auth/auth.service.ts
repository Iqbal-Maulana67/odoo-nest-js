import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OdooService } from '../odoo/odoo.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private odooService: OdooService,
  ) {}

  async login(login: string, password: string) {
    const uid = await this.odooService.authenticate(login, password);

    if (!uid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const users = await this.odooService.call('res.users', 'read', [[uid]], {
      fields: ['id', 'name', 'email', 'login'],
    });
    const user = users[0];

    const payload = {
      sub: user.id,
      email: user.email || user.login,
      name: user.name,
      role: 'user',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email || user.login,
      },
    };
  }
}