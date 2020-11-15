import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Customer } from './customer';
import { CustomerType } from './customerType';
import { Invoice } from './invoice';
import { InvoiceType } from './invoiceType';
import { PaymentMethod } from './paymentMethod';
import { VatRate } from './vatRate';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    var customerOne = { id: 1, type: CustomerType.INDIVIDUAL, sex: 'M', firstName: 'First', lastName: 'Last', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com' };
    var customerTwo = { id: 2, type: CustomerType.INDIVIDUAL, sex: 'V', firstName: 'Voor', lastName: 'Achter', street: 'Streetname', houseNumber: '32', boxNumber: 'a', postalCode: '2000', city: 'Antwerpen', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com' };
    const customers = [
      customerOne, customerTwo
    ];
    const invoices = [
      { id: 1, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", paymentMethod: PaymentMethod.BANK_ACCOUNT, customer: customerOne, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 6, total: 106},
      { id: 2, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", paymentMethod: PaymentMethod.CREDIT_CARD, customer: customerTwo, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 21, total: 121},
    ];
    return { customers, invoices };
  }

  genId<T extends Customer | Invoice>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}