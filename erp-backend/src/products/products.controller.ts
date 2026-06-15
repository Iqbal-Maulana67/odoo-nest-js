import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Delete,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('search') search = '',
  ) {
    return this.productsService.findAll(+limit, +offset, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      list_price: number;
      default_code?: string;
      qty_available: number;
      type: string;
    },
  ) {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.destroy(+id);
  }
}
