import { Module } from '@nestjs/common';
import { reportController } from './reports.controller';
import { reportService } from './reports.service';
import { OdooModule } from '../odoo/odoo.module';

@Module({
  imports: [OdooModule],
  controllers: [reportController],
  providers: [reportService],
})
export class reportModule {}
