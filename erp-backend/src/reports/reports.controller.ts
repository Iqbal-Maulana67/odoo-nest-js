import { Controller, Get } from '@nestjs/common';
import { reportService } from './reports.service';

@Controller('api/reports')
export class reportController {
  constructor(private reportService: reportService) {}

  @Get('sales-summary')
  salesSummary() {
    return this.reportService.getSalesSummary();
  }

  @Get('revenue-trend')
  revenueTrend() {
    return this.reportService.getRevenueTrend();
  }

  @Get('top-product')
  topProduct() {
    return this.reportService.getTopProduct();
  }

  @Get('top-customer')
  topCustomer() {
    return this.reportService.getTopCustomer();
  }

  @Get('invoice-status')
  invoiceStatus() {
    return this.reportService.getInvoiceStatus();
  }

  @Get('stock-summary')
  getStockSummary() {
    return this.reportService.getStockSummary();
  }
}
