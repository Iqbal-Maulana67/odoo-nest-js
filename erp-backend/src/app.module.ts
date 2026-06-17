import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { OdooModule } from './odoo/odoo.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { invoicesModule } from './invoices/invoices.module';
import { reportModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OdooModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    CustomersModule,
    invoicesModule,
    reportModule
  ],
  providers: [
    // Guard global — semua route terlindungi kecuali yang @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}