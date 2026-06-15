import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerService } from './customers.service';
import { createCustomerDto } from './dto/create-customer.dto';
import { updateCustomerDto } from './dto/update-customer.dto';

@Controller('api/customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private customersService: CustomerService) {}

  @Get()
  findAll(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('search') search = '',
  ) {
    return this.customersService.findAll(+limit, +offset, search);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customersService.findOne(id);
  }

  @Get(':id/orders')
  findOrder(@Param('id') id:number) {
    return this.customersService.findOrder(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: createCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: updateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  unlink(@Param('id') id: number) {
    return this.customersService.unlink(id);
  }
}
