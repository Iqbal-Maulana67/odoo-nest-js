// src/products/products.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';

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

  async create(data: {
    name: string;
    list_price: number;
    default_code?: string;
    qty_available: number;
    type: string;
  }) {
    this.logger.log(`Created data with data:`, data);
    const productId = await this.odoo.call('product.product', 'create', [
      {
        name: data.name,
        list_price: data.list_price,
        qty_available: data.qty_available,
        default_code: data.default_code,
        type: data.type,
      },
    ]);

    if (data.qty_available && data.qty_available > 0) {
      await this.odoo.call('stock.quant', 'create', [
        {
          product_id: productId,
          location_id: 8,
          quantity: data.qty_available,
        },
      ]);
    }

    return { id: productId, success: true };
  }

  async update(id: number, data: any) {
    this.logger.log(`Update data with data:`, data);
    await this.odoo.call('product.product', 'write', [
      [id],
      {
        name: data.name,
        list_price: data.list_price,
        default_code: data.default_code,
        type: data.type,
      },
    ]);

    if (
      data.qty_available !== undefined &&
      data.qty_available >= 0 &&
      data.type == 'product'
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
        // Update stock.quant yang sudah ada
        await this.odoo.call('stock.quant', 'write', [
          [quants[0].id], // ← ID record stock.quant
          { quantity: data.qty_available },
        ]);
      } else {
        // Belum ada record stok, buat baru
        await this.odoo.call('stock.quant', 'create', [
          {
            product_id: id,
            location_id: 8,
            quantity: data.qty_available,
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
