export enum invoiceMoveType {
  OUT_INVOICE = 'out_invoice',
  OUT_REFUND = 'out_refund',
  IN_INVOICE = 'in_invoice',
  IN_REFUND = 'in_refund',
}


export enum invoiceStatusType {
  DRAFT = 'draft',
  POSTED = 'posted',
  CANCEL = 'cancel',
  NULL = ''
}

export enum invoicePaymentState {
  NOT_PAID = 'not_paid',
  PARTIAL = 'partial',
  PAID = 'paid',
  IN_PAYMENT = 'in_payment',
  REVERSED = 'reversed'
}
