import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Customer } from './customer';
import { CustomerType } from './customerType';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const customers = [
      { id: 1, type: CustomerType.INDIVIDUAL, sex: 'M', firstName: 'First', lastName: 'Last', street: 'Straatnaam', houseNumber: '5', busNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com' },
      { id: 2, type: CustomerType.INDIVIDUAL, sex: 'V', firstName: 'Voor', lastName: 'Achter', street: 'Streetname', houseNumber: '32', busNumber: 'a', postalCode: '2000', city: 'Antwerpen', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com' },
      //{ id: 3, type: CustomerType.COMPANY, taxNumber: 'BE132457787', comanyName: 'Company', street: 'Streetname', houseNumber: '50', busNumber: 'a', postalCode: '2000', city: 'Antwerpen', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com' },
    ];
    return { customers };
  }

  genId(customers: Customer[]): number {
    return customers.length > 0 ? Math.max(...customers.map(customer => customer.id)) + 1 : 11;
  }
}
