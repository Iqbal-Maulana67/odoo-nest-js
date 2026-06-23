import { Injectable, Logger } from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import { createCustomerDto } from './dto/create-customer.dto';
import { updateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private odoo: OdooService) {}
  private readonly logger = new Logger('CustomerService');

  async findAll(limit: number = 20, offset: number = 0, search: string = '') {
    return this.odoo.call(
      'res.partner',
      'search_read',
      [
        [
          ['active', '=', true],
          ['name', 'ilike', search],
          ['email', 'ilike', search],
        ],
      ],
      {
        fields: [
          'id',
          'name',
          'email',
          'phone',
          'mobile',
          'street',
          'city',
          'vat',
          'country_id',
          'is_company',
        ],
        limit,
        offset,
      },
    );
  }

  async findOne(id: number) {
    return this.odoo.call('res.partner', 'read', [[id]], {
      fields: [
        'id',
        'name',
        'email',
        'phone',
        'mobile',
        'street',
        'city',
        'vat',
        'country_id',
        'is_company',
      ],
    });
  }

  async findOrder(id: number) {
    const sales = await this.odoo.call(
      'sale.order',
      'search_read',
      [[['partner_id', '=', id]]],
      {
        fields: [
          'id',
          'name',
          'partner_id',
          'state',
          'amount_total',
          'date_order',
          'invoice_status',
          'order_line',
        ],
      },
    );

    return { customer_id: id, sales };
  }

  async create(dto: createCustomerDto) {
    await this.odoo.call('res.partner', 'create', [dto]);
    this.logger.log('Added Customer Data: ', dto);
  }

  async update(id: number, dto: updateCustomerDto) {
    this.logger.log(`Update customer data ID: ${id}`, dto);

    await this.odoo.call('res.partner', 'write', [[id], dto]);

    return { id, success: true };
  }

  async unlink(id: number) {
    this.logger.log(`Unlink customer data ID: ${id}`);

    await this.odoo.call('res.partner', 'unlink', [id]);

    return { id, success: true };
  }
}
