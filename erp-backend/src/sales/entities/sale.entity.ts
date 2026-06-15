export enum SaleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class Sale {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  status: SaleStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}