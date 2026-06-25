import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly odoo: OdooService) {}

  async findAll(limit = 20, offset = 0, state = '', sortDate: string) {
    const domain: any[] = [];

    // Filter by state jika ada
    if (state) {
      domain.push(['state', '=', state]);
    }

    return this.odoo.call('sale.order', 'search_read', [domain], {
      fields: [
        'id',
        'name', // nomor order (S00001)
        'partner_id', // customer
        'state', // draft | sale | cancel | done
        'amount_total', // total harga
        'date_order', // tanggal order
        'invoice_status', // status invoice
      ],
      limit,
      offset,
      order: 'date_order ' + sortDate,
    });
  }

  async findOne(id: number) {
    // Ambil header order
    const orders = await this.odoo.call('sale.order', 'read', [[id]], {
      fields: [
        'id',
        'name',
        'partner_id',
        'state',
        'amount_total',
        'date_order',
        'invoice_status',
        'note',
        'order_line', // ID list dari order lines
      ],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Order ID ${id} tidak ditemukan`);
    }

    const order = orders[0];

    // Filtering empty notes
    if (!order.note) {
      order.note = '';
    }

    // Ambil detail order lines
    const lines = await this.odoo.call(
      'sale.order.line',
      'read',
      [order.order_line],
      {
        fields: [
          'id',
          'product_id', // produk
          'product_uom_qty', // jumlah
          'price_unit', // harga satuan
          'price_subtotal', // subtotal
        ],
      },
    );

    return { ...order, order_line: lines };
  }

  async create(dto: CreateSaleDto) {
    // Buat sale.order header
    const orderId = await this.odoo.call('sale.order', 'create', [
      {
        partner_id: dto.customerId,
        order_line: dto.items.map((item) => [
          0,
          0, // command Odoo untuk create line baru
          {
            product_id: item.productId,
            product_uom_qty: item.quantity,
            price_unit: item.unitPrice,
          },
        ]),
        note: dto.notes ?? '',
      },
    ]);

    return { id: orderId, success: true };
  }

  async update(id: number, dto: UpdateSaleDto) {
    const orders = await this.odoo.call('sale.order', 'read', [[id]], {
      fields: ['state', 'order_line'],
    });

    const order = orders[0];

    if (order.state !== 'draft') {
      throw new BadRequestException('Hanya order draft yang bisa diedit');
    }

    const lines = await this.odoo.call(
      'sale.order.line',
      'read',
      [order.order_line],
      {
        fields: ['id', 'product_id'],
      },
    );

    // Update notes
    await this.odoo.call('sale.order', 'write', [
      [id],
      {
        note: dto.notes ?? '',
      },
    ]);

    // Cari line yang tidak ada di dto.items → hapus
    const itemProductIds = dto.items.map((item) => item.productId);
    const linesToDelete = lines.filter(
      (line) => !itemProductIds.includes(line.product_id[0]),
    );

    if (linesToDelete.length > 0) {
      const deleteIds = linesToDelete.map((line) => line.id);
      await this.odoo.call('sale.order.line', 'unlink', [deleteIds]);
    }

    // Update atau tambah item
    await Promise.all(
      dto.items.map(async (item) => {
        const existingLine = lines.find(
          (line) => line.product_id[0] === item.productId,
        );

        if (existingLine) {
          // Update line yang sudah ada
          await this.odoo.call('sale.order.line', 'write', [
            [existingLine.id],
            {
              product_uom_qty: item.quantity,
              price_unit: item.unitPrice,
            },
          ]);
        } else {
          // Tambah line baru
          await this.odoo.call('sale.order', 'write', [
            [id],
            {
              order_line: [
                [
                  0,
                  0,
                  {
                    product_id: item.productId,
                    product_uom_qty: item.quantity,
                    price_unit: item.unitPrice,
                  },
                ],
              ],
            },
          ]);
        }
      }),
    );

    return { id, success: true, message: 'Successfully updated the data' };
  }

  async confirm(id: number) {
    // Konfirmasi order: draft → sale
    const result = await this.odoo.call('sale.order', 'action_confirm', [[id]]);
    if (!result) {
      throw new BadRequestException(`Gagal konfirmasi order ID ${id}`);
    }
    return { id, success: true, message: 'Order berhasil dikonfirmasi' };
  }

  async cancel(id: number) {
    // Batalkan order
    await this.odoo.call('sale.order', 'action_cancel', [[id]]);
    return { id, success: true, message: 'Order berhasil dibatalkan' };
  }

  async remove(id: number) {
    // Hanya bisa hapus order yang masih draft
    const orders = await this.odoo.call('sale.order', 'read', [[id]], {
      fields: ['state'],
    });

    if (orders[0].state !== 'draft') {
      throw new BadRequestException(
        'Hanya order dengan status draft yang bisa dihapus',
      );
    }

    await this.odoo.call('sale.order', 'unlink', [[id]]);
    return { message: `Order ID ${id} berhasil dihapus` };
  }

  async getSummary() {
    const [total, confirmed, cancelled] = await Promise.all([
      this.odoo.call('sale.order', 'search_count', [[]]),
      this.odoo.call('sale.order', 'search_count', [[['state', '=', 'sale']]]),
      this.odoo.call('sale.order', 'search_count', [
        [['state', '=', 'cancel']],
      ]),
    ]);

    return {
      total,
      confirmed,
      cancelled,
      draft: total - confirmed - cancelled,
    };
  }
}
