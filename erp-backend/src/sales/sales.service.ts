import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly odoo: OdooService) {}

  async findAll(limit = 20, offset = 0, state = '') {
    const domain: any[] = [];

    // Filter by state jika ada
    if (state) {
      domain.push(['state', '=', state]);
    }

    return this.odoo.call('sale.order', 'search_read', [domain], {
      fields: [
        'id',
        'name',           // nomor order (S00001)
        'partner_id',     // customer
        'state',          // draft | sale | cancel | done
        'amount_total',   // total harga
        'date_order',     // tanggal order
        'invoice_status', // status invoice
      ],
      limit,
      offset,
      order: 'date_order desc',
    });
  }

  async findOne(id: number) {
    // Ambil header order
    const orders = await this.odoo.call('sale.order', 'read', [[id]], {
      fields: [
        'id', 'name', 'partner_id', 'state',
        'amount_total', 'date_order', 'invoice_status',
        'order_line', // ID list dari order lines
      ],
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`Order ID ${id} tidak ditemukan`);
    }

    const order = orders[0];

    // Ambil detail order lines
    const lines = await this.odoo.call('sale.order.line', 'read', [order.order_line], {
      fields: [
        'id',
        'product_id',       // produk
        'product_uom_qty',  // jumlah
        'price_unit',       // harga satuan
        'price_subtotal',   // subtotal
      ],
    });

    return { ...order, order_line: lines };
  }

  async create(dto: CreateSaleDto) {
    // Buat sale.order header
    const orderId = await this.odoo.call('sale.order', 'create', [{
      partner_id: dto.customerId,
      order_line: dto.items.map((item) => [
        0, 0, // command Odoo untuk create line baru
        {
          product_id: item.productId,
          product_uom_qty: item.quantity,
          price_unit: item.unitPrice,
        },
      ]),
      note: dto.notes ?? '',
    }]);

    return { id: orderId, success: true };
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

  async update(id: number, dto: UpdateSaleDto) {
    await this.odoo.call('sale.order', 'write', [[id], {
      note: dto.notes,
    }]);
    return { id, success: true };
  }

  async remove(id: number) {
    // Hanya bisa hapus order yang masih draft
    const orders = await this.odoo.call('sale.order', 'read', [[id]], {
      fields: ['state'],
    });

    if (orders[0].state !== 'draft') {
      throw new BadRequestException(
        'Hanya order dengan status draft yang bisa dihapus'
      );
    }

    await this.odoo.call('sale.order', 'unlink', [[id]]);
    return { message: `Order ID ${id} berhasil dihapus` };
  }

  async getSummary() {
    const [total, confirmed, cancelled] = await Promise.all([
      this.odoo.call('sale.order', 'search_count', [[]]),
      this.odoo.call('sale.order', 'search_count', [[['state', '=', 'sale']]]),
      this.odoo.call('sale.order', 'search_count', [[['state', '=', 'cancel']]]),
    ]);

    return { total, confirmed, cancelled, draft: total - confirmed - cancelled };
  }
}