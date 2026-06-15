import { Module } from '@nestjs/common';
import { OdooService } from './odoo.service';
 
@Module({
  providers: [OdooService],
  exports: [OdooService], // agar bisa dipakai di AuthModule & ProductsModule
})
export class OdooModule {}
 