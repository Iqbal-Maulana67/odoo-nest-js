import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import {
  invoiceMoveType,
  invoicePaymentState,
  invoiceStatusType,
} from './entities/invoice.entity';
import { createInvoiceDto } from './dto/create-invoice.dto';
import { updateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class invoicesService {
  constructor(private odoo: OdooService) {}

  private logger = new Logger('invoiceServiceLoge');

  async findAll(
    limit = 20,
    offset = 0,
    state?: invoiceStatusType,
    payment_state?: invoicePaymentState,
  ) {
    return this.odoo.call(
      'account.move',
      'search_read',
      [
        [
          ['move_type', '=', invoiceMoveType.OUT_INVOICE],
          ['state', 'ilike', state],
          ['payment_state', 'ilike', payment_state],
        ],
      ],
      {
        fields: [
          'id',
          'name',
          'partner_id',
          'move_type',
          'state',
          'invoice_date',
          'invoice_date_due',
          'amount_untaxed',
          'amount_tax',
          'amount_total',
          'amount_residual',
          'payment_state',
          'invoice_line_ids',
        ],
        limit,
        offset,
      },
    );
  }

  async findOne(id: number) {
    const invoices: any = await this.odoo.call('account.move', 'read', [[id]], {
      fields: [
        'id',
        'name',
        'partner_id',
        'move_type',
        'state',
        'invoice_date',
        'invoice_date_due',
        'amount_untaxed',
        'amount_tax',
        'amount_total',
        'amount_residual',
        'payment_state',
        'invoice_line_ids',
      ],
    });

    if (!invoices || invoices.length === 0) {
      throw new NotFoundException(`Invoice Id ${id} tidak ditemukan`);
    }

    const invoice = invoices[0];

    const invoiceItem = await this.odoo.call(
      'account.move.line',
      'search_read',
      [[['move_id', '=', invoice.id]]],
      {
        fields: [
          'id',
          'move_id',
          'product_id',
          'name',
          'quantity',
          'price_unit',
          'price_subtotal',
          'tax_ids',
        ],
      },
    );

    return {
      invoice: invoice,
      invoice_items: invoiceItem,
    };
  }

  async create(dto: createInvoiceDto) {
    const accounts = await this.odoo.call(
      'account.account',
      'search_read',
      [[['account_type', '=', 'income']]],
      { fields: ['id', 'name'], limit: 1 },
    );

    if (!accounts || accounts.length === 0) {
      throw new BadRequestException(
        'Tidak ada akun income yang terkonfigurasi di Odoo',
      );
    }

    const incomeAccountId = accounts[0].id;

    return this.odoo.call('account.move', 'create', [
      {
        partner_id: dto.partner_id,
        invoice_date: dto.invoice_date,
        invoice_date_due: dto.invoice_date_due,
        move_type: invoiceMoveType.OUT_INVOICE,
        invoice_line_ids: dto.items.map((item) => [
          0,
          0, // command Odoo untuk create line baru
          {
            product_id: item.product_id,
            quantity: item.quantity,
            price_unit: item.price_unit,
            name: item.name,
            account_id: incomeAccountId,
          },
        ]),
        narration: dto.notes,
      },
    ]);
  }

  async update(id: number, dto: updateInvoiceDto) {
    // Cek state dulu
    const invoices = await this.odoo.call('account.move', 'read', [[id]], {
      fields: ['state'],
    });

    if (invoices[0].state !== 'draft') {
      throw new BadRequestException(
        'Invoice yang sudah posted/cancel tidak bisa diupdate',
      );
    }

    const updateData: any = {};

    // Check field kosong
    if (dto.partner_id !== undefined) updateData.partner_id = dto.partner_id;
    if (dto.invoice_date !== undefined)
      updateData.invoice_date = dto.invoice_date;
    if (dto.invoice_date_due !== undefined)
      updateData.invoice_date_due = dto.invoice_date_due;
    if (dto.notes !== undefined) updateData.narration = dto.notes;

    if (dto.items && dto.items.length > 0) {
      // Hapus semua line lama, ganti dengan yang baru
      const existingLines = await this.odoo.call(
        'account.move.line',
        'search',
        [
          [
            ['move_id', '=', id],
            ['product_id', '!=', false],
          ],
        ],
      );

      const lineCommands = [
        // Hapus line lama
        ...existingLines.map((lineId: number) => [2, lineId, 0]),

        // Tambah line baru
        ...dto.items.map((item) => [
          0,
          0,
          {
            product_id: item.product_id,
            quantity: item.quantity,
            price_unit: item.price_unit,
            name: item.name,
          },
        ]),
      ];

      updateData.invoice_line_ids = lineCommands;
    }

    this.logger.log('update data', updateData);

    await this.odoo.call('account.move', 'write', [[id], updateData]);

    return true;
  }

  async confirm(id: number) {
    this.logger.log(`Confirming invoice ID ${id}...`);
    try {
      await this.odoo.call('account.move', 'action_post', [[id]]);

      return {
        success: true,
        message: `Invoice ID ${id} berhasil dikonfirmasi`,
      };
    } catch (error: any) {
      this.logger.error(error.message);
      throw new BadRequestException(
        `Gagal konfirmasi invoince ID ${id}: ${error.message}`,
      );
    }
  }

  async cancel(id: number) {
    try {
      await this.odoo.call('account.move', 'button_cancel', [[id]]);
      return { success: true, message: `Invoice ID ${id} berhasil dibatalkan` };
    } catch (error: any) {
      if (!error.message?.includes('cannot marshal None')) {
        this.logger.error(error.message);
        throw new BadRequestException(
          `Gagal cancel invoice ID ${id}: ${error.message}`,
        );
      }
      return { success: true, message: `Invoice ID ${id} berhasil dibatalkan` };
    }
  }
}
