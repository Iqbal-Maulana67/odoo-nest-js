// src/products/products.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import { createProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private odoo: OdooService) {}
  private readonly logger = new Logger('ProductService');

  async findAll(limit = 20, offset = 0, search = '') {
    return this.odoo.call(
      'product.product',
      'search_read',
      [
        [
          ['active', '=', true],
          ['name', 'ilike', search],
        ],
      ],
      {
        fields: [
          'id',
          'name',
          'list_price',
          'qty_available',
          'default_code',
          'type',
        ],
        limit,
        offset,
      },
    );
  }

  async findOne(id: number) {
    const result = await this.odoo.call('product.product', 'read', [[id]], {
      fields: ['id', 'name', 'list_price', 'qty_available', 'description'],
    });
    return result[0];
  }

  async create(dto: createProductDto) {
    this.logger.log(`Created data with data:`, dto);
    const productId = await this.odoo.call('product.product', 'create', [dto]);

    if (dto.qty_available && dto.qty_available > 0) {
      await this.odoo.call('stock.quant', 'create', [
        {
          product_id: productId,
          location_id: 8,
          quantity: dto.qty_available,
        },
      ]);
    }

    return { id: productId, success: true };
  }

  async update(id: number, dto: updateProductDto) {
    this.logger.log(`Update data with data:`, dto);
    await this.odoo.call('product.product', 'write', [[id], dto]);

    if (
      dto.qty_available !== undefined &&
      dto.qty_available >= 0 &&
      dto.type == 'product'
    ) {
      const quants = await this.odoo.call(
        'stock.quant',
        'search_read',
        [
          [
            ['product_id', '=', id],
            ['location_id.usage', '=', 'internal'], // hanya gudang internal
          ],
        ],
        {
          fields: ['id', 'quantity'],
          limit: 1,
        },
      );

      if (quants.length > 0) {
        await this.odoo.call('stock.quant', 'write', [
          [quants[0].id], // ← ID record stock.quant
          { quantity: dto.qty_available },
        ]);
      } else {
        await this.odoo.call('stock.quant', 'create', [
          {
            product_id: id,
            location_id: 8,
            quantity: dto.qty_available,
          },
        ]);
      }
    }
  }

  async destroy(id: number) {
    // Ambil template_id dari product.product dulu
    const product = await this.odoo.call('product.product', 'read', [[id]], {
      fields: ['id', 'product_tmpl_id'],
    });

    const templateId = product[0].product_tmpl_id[0];

    // Archive lewat product.template, bukan product.product
    return this.odoo.call('product.template', 'write', [
      [templateId],
      { active: false },
    ]);
  }
}
