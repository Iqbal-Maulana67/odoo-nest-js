import { Module } from "@nestjs/common";
import { OdooService } from "../odoo/odoo.service";
import { CustomerController } from "./customers.controller";
import { CustomerService } from "./customers.service";
import { OdooModule } from "../odoo/odoo.module";

@Module({
  imports: [OdooModule],
  controllers: [CustomerController],
  providers: [CustomerService]
})

export class CustomersModule {}