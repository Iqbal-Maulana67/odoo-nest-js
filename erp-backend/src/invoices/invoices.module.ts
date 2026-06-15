import { Module } from "@nestjs/common";
import { OdooModule } from "../odoo/odoo.module";
import { invoicesController } from "./invoices.controller";
import { invoicesService } from "./invoices.service";



@Module({
  imports: [OdooModule],
  controllers: [invoicesController],
  providers: [invoicesService]
})

export class invoicesModule {


}