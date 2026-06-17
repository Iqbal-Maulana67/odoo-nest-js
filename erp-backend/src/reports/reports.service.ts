import { Injectable, Logger } from '@nestjs/common';
import { OdooService } from '../odoo/odoo.service';
import {
  invoiceMoveType,
  invoiceStatusType,
} from '../invoices/entities/invoice.entity';
import { groupBy } from 'rxjs';

@Injectable()
export class reportService {
  constructor(private odoo: OdooService) {}

  private logger = new Logger('reportService');

  async getSalesSummary() {
    const total_orders = await this.odoo.call(
      'sale.order',
      'search_count',
      [[]],
      {},
    );

    const revenues = await this.odoo.call('sale.order', 'search_read', [[]], {
      fields: ['amount_total'],
    });
    var total_revenue = 0;

    revenues.map((revenue) => {
      total_revenue += parseInt(revenue.amount_total);
    });

    const by_state = await this.odoo.call('sale.order', 'read_group', [[]], {
      fields: ['amount_total:count', 'amount_total:sum'],
      groupby: ['state'],
    });

    return {
      total_orders,
      total_revenue,
      by_state,
    };
  }

  async getRevenueTrend() {
    const data = await this.odoo.call(
      'account.move',
      'read_group',
      [
        [
          ['move_type', '=', invoiceMoveType.OUT_INVOICE],
          ['state', '=', invoiceStatusType.POSTED],
        ],
      ],
      {
        fields: ['amount_untaxed:sum'],
        groupby: ['invoice_date:month'],
      },
    );
    var revenueTrend: any = [];

    data.map((trend) => {
      revenueTrend.push({
        month: trend['invoice_date:month'],
        revenue: trend.amount_untaxed,
      });
    });

    return revenueTrend;
  }

  async getTopProduct() {
    const data = await this.odoo.call('sale.order.line', 'read_group', [[]], {
      fields: ['product_uom_qty:sum', 'price_subtotal:sum'],
      groupby: ['product_id'],
    });

    var topProduct: any = [];

    data.map((product) => {
      topProduct.push({
        product_id: product.product_id[0], // product id
        product_name: product.product_id[1], // product name
        total_qty: product.product_uom_qty,
        total_revenue: product.price_subtotal,
      });
    });
    return topProduct;
  }

  async getTopCustomer() {
    const data = await this.odoo.call('sale.order', 'read_group', [[]], {
      fields: ['amount_total:sum'],
      groupby: ['partner_id'],
      orderby: 'amount_total DESC',
    });

    var topCustomer: any = [];

    data.map((customer) => {
      topCustomer.push({
        partner_id: customer.partner_id[0], // [0] partner id
        partner_name: customer.partner_id[1], // [1] partner name
        total_order: customer.partner_id_count,
        total_spent: customer.amount_total,
      });
    });

    return topCustomer;
  }

  async getInvoiceStatus() {
    const data = await this.odoo.call('account.move', 'read_group', [[]], {
      fields: ['amount_untaxed'],
      groupby: ['payment_state'],
    });

    var invoiceStatus: any = [];

    data.map((invoice) => {
      invoiceStatus.push({
        payment_state: invoice.payment_state,
        total_state: invoice.payment_state_count,
        total_amount: invoice.amount_untaxed,
      });
    });

    return invoiceStatus;
  }

  async getStockSummary(threshold = 10) {
    // Ambil semua stok
    const result = await this.odoo.call('stock.quant', 'read_group', [
      [['location_id.usage', '=', 'internal']],
      ['product_id', 'quantity:sum', 'reserved_quantity:sum'],
      ['product_id'],
    ]);

    // Ambil harga produk untuk hitung nilai stok
    const productIds = result.map((item: any) => item.product_id[0]);
    const products = await this.odoo.call(
      'product.product',
      'read',
      [productIds],
      {
        fields: ['id', 'list_price'],
      },
    );

    // Buat map id → list_price untuk lookup cepat
    const priceMap: Record<number, number> = {};
    products.forEach((p: any) => {
      priceMap[p.id] = p.list_price;
    });

    // Hitung setiap field
    const total_products = result.length;

    const total_stock_value = result.reduce((sum: number, item: any) => {
      const price = priceMap[item.product_id[0]] ?? 0;
      return sum + item.quantity * price;
    }, 0);

    const low_stock_items = result
      .filter((item: any) => item.quantity < threshold)
      .map((item: any) => ({
        product_id: item.product_id[0],
        product_name: item.product_id[1],
        quantity: item.quantity,
        reserved: item.reserved_quantity,
        available: item.quantity - item.reserved_quantity,
      }));

    return {
      total_products,
      total_stock_value,
      low_stock_items,
    };
  }
}
