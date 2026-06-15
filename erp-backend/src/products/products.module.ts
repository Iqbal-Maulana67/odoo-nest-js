import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { OdooModule } from '../odoo/odoo.module';

@Module({
  imports: [OdooModule], // butuh OdooService untuk XML-RPC
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}