import { Customer } from './customer';
import { VatRate } from './vatRate';
import { PaymentMethod } from './paymentMethod';
import { InvoiceType } from './invoiceType';

export class Invoice {
  readonly id: number;
  date: Date;
  type: InvoiceType;
  description: string;
  conditions?: string;
  paymentMethod?: PaymentMethod;
  customer: Customer;
  subTotal: number;
  vatRate: VatRate;
  vatAmount: number;
  total: number;
  year: number;
  index: number;
  number: string;

  constructor() {
    this.date = new Date();
    this.customer = new Customer();
  }
}