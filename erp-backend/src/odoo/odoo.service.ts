// src/odoo/odoo.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as xmlrpc from 'xmlrpc';

@Injectable()
export class OdooService implements OnModuleInit {
  private readonly logger = new Logger(OdooService.name);
  private uid: number = -1;
  private commonClient: any;
  private objectClient: any;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const host = this.config.get('ODOO_HOST', 'localhost');
    const port = Number(this.config.get('ODOO_PORT', 8069));

    this.commonClient = xmlrpc.createClient({
      host,
      port,
      path: '/xmlrpc/2/common',
    });
    this.objectClient = xmlrpc.createClient({
      host,
      port,
      path: '/xmlrpc/2/object',
    });

    // Login dengan kredensial dari .env saat startup
    const uid = await this.authenticate(
      this.config.get<string>('ODOO_USER', ''),
      this.config.get<string>('ODOO_PASSWORD', ''),
    );
    this.logger.log(this.config.get('ODOO_USER'))
    if (!uid) {
      this.logger.error('Gagal konek ke Odoo — periksa kredensial di .env');
    } else {
      this.uid = uid;
      this.logger.log(`Terhubung ke Odoo (uid: ${uid})`);
    }
  }

  /**
   * Autentikasi ke Odoo.
   * - Dipanggil saat startup: pakai ODOO_USER & ODOO_PASSWORD dari .env
   * - Dipanggil dari AuthService: pakai login/password dari user
   */
  async authenticate(
    login: string,
    password: string,
  ): Promise<number | null> {
    return new Promise((resolve) => {
      this.commonClient.methodCall(
        'authenticate',
        [this.config.get('ODOO_DB'), login, password, {}],
        (err: any, uid: number) => {
          if (err || !uid) return resolve(null);
          resolve(uid);
        },
      );
    });
  }

  /**
   * Panggil method pada model Odoo via XML-RPC.
   * Menggunakan uid admin dari .env untuk operasi internal.
   */
  call(model: string, method: string, args: any[], kwargs = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.objectClient.methodCall(
        'execute_kw',
        [
          this.config.get('ODOO_DB'),
          this.uid,
          this.config.get('ODOO_PASSWORD'),
          model,
          method,
          args,
          kwargs,
        ],
        (err: any, result: any) => (err ? reject(err) : resolve(result)),
      );
    });
  }
}