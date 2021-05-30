import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Customer } from './model/customer';
import { CustomerType } from './model/customerType';
import { Invoice } from './model/invoice';
import { InvoiceType } from './model/invoiceType';
import { VatRate } from './model/vatRate';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    var customerOne = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20 001' };
    var customerTwo = { id: 2, type: CustomerType.INDIVIDUAL, name: 'Achter Voor', street: 'Streetname', houseNumber: '32', boxNumber: 'a', postalCode: '2000', city: 'Antwerpen', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 2, number: 'K20 002' };
    var customerThree = { id: 3, type: CustomerType.COMPANY, name: 'Bedrijf', taxNumber: '0123456789', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 3, number: 'K20 003', foreign: false };
    var customerFour = { id: 4, type: CustomerType.COMPANY, name: 'Buitenlands', taxNumber: 'NL X 325478745744', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', country: 'Nederland', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 4, number: 'K20 004', foreign: true };
    var customerFive = { id: 5, type: CustomerType.COMPANY, name: 'Cust 2021', taxNumber: 'NL X 325478745744', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', country: 'Nederland', phone: '035474748', mobile: '0478777855', email: '2021.test@gmail.com', year: 2021, index: 1, number: 'K21 001', foreign: true };
    const customers = [
      customerOne, customerTwo, customerThree, customerFour, customerFive
    ];
    const invoices = [
      { id: 1, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", customer: customerOne, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 6, total: 106, year: 2020, index: 1, number: 'F20 001'},
      { id: 2, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", customer: customerTwo, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 21, total: 121, year: 2020, index: 2, number: 'F20 002'},
      { id: 3, type: InvoiceType.INVOICE, date: new Date(), conditions: "Voorwaarden", description: "Het plaatsen van bla bla\ntest\nnog een lijn\nen nog een\nen zo voor\nen zo verder\neen laatste", 
      customer: customerFour, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 21, total: 121, year: 2020, index: 3, number: 'F20 003'},
      { id: 4, type: InvoiceType.CREDIT_NOTE, date: new Date(), conditions: "Voorwaarden", description: "Omschrijving", customer: customerTwo, subTotal: 100, vatRate: VatRate.SIX, vatAmount: 21, total: 121, year: 2020, index: 1, number: 'C20 001'},
    ];
    return { customers, invoices };
  }

  genId<T extends Customer | Invoice>(myTable: T[]): number {
    return myTable.length > 0 ? Math.max(...myTable.map(t => t.id)) + 1 : 11;
  }
}