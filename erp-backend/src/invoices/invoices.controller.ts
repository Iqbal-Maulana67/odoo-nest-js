import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  invoicePaymentState,
  invoiceStatusType,
} from './entities/invoice.entity';
import { invoicesService } from './invoices.service';
import { createInvoiceDto } from './dto/create-invoice.dto';
import { updateInvoiceDto } from './dto/update-invoice.dto';

@Controller('api/invoices')
export class invoicesController {
  constructor(private readonly invoiceService: invoicesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('state') state?: invoiceStatusType,
    @Query('payment_state') payment_state?: invoicePaymentState,
  ) {
    return this.invoiceService.findAll(limit, offset, state, payment_state);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id')  id: number
  ){
    return this.invoiceService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInvoiceDto : createInvoiceDto){
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateInvoiceDto : updateInvoiceDto){
    return this.invoiceService.update(id, updateInvoiceDto)
  }
}
