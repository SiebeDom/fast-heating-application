import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Customer } from './model/customer';
import { CustomerType } from './model/customerType';
import { Invoice } from './model/invoice';
import { InvoiceType } from './model/invoiceType';
import { PaymentMethod } from './model/paymentMethod';
import { VatRate } from './model/vatRate';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    var customerOne = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20 001' };
    var customerTwo = { id: 2, type: CustomerType.INDIVIDUAL, name: 'Achter Voor', street: 'Streetname', houseNumber: '32', boxNumber: 'a', postalCode: '2000', city: 'Antwerpen', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 2, number: 'K20 002' };
    var customerThree = { id: 3, type: CustomerType.COMPANY, name: 'Bedrijf', taxNumber: 'BE-123.456.789', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 3, number: 'K20 003' };
    const customers = [
      customerOne, customerTwo, customerThree
    ];
    const invoices = [
      { id: 1, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", paymentMethod: PaymentMethod.BANK_ACCOUNT, customer: customerOne, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 6, total: 106, year: 2020, index: 1, number: 'F20 001'},
      { id: 2, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", paymentMethod: PaymentMethod.CREDIT_CARD, customer: customerTwo, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 21, total: 121, year: 2020, index: 2, number: 'F20 002'},
    ];
    return { customers, invoices };
  }

  genId<T extends Customer | Invoice>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}