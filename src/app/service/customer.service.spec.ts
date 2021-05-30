import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { asyncData, asyncError } from '../../testing/async-observable-helpers';

import { CustomerService } from './customer.service';
import { Customer } from '../model/customer';
import { CustomerType } from '../model/customerType';

describe('CustomersService (with mocks)', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [CustomerService]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    customerService = TestBed.inject(CustomerService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  /// CustomerService method tests begin ///
  describe('#getCustomers', () => {
    let expectedCustomers: Customer[];

    beforeEach(() => {
      customerService = TestBed.inject(CustomerService);
      expectedCustomers = [{ id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' }
      ] as Customer[];
    });

    it('should return expected customers (called once)', () => {
      customerService.getCustomers().subscribe(
        customers => expect(customers).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      // CustomerService should have made one request to GET customers from expected URL
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock customers
      req.flush(expectedCustomers);
    });

    it('should be OK returning no customers', () => {
      customerService.getCustomers().subscribe(
        customers => expect(customers.length).toEqual(0, 'should have empty customers array'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);
      req.flush([]); // Respond with no customers
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';
      customerService.getCustomers().subscribe(
        customers => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected customers (called multiple times)', () => {
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe(
        customers => expect(customers).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      const requests = httpTestingController.match(customerService.customersUrl);
      expect(requests.length).toEqual(3, 'calls to getCustomers()');

      // Respond to each request with different mock customer results
      requests[0].flush([]);
      requests[1].flush([{ id: 3, type: CustomerType.COMPANY, name: 'Bedrijf', taxNumber: '0123456789', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 3, number: 'K20.003', foreign: false }]);
      requests[2].flush(expectedCustomers);
    });
  });

  describe('#getCustomersOfThisYear', () => {
    let expectedCustomers: Customer[];

    beforeEach(() => {
      customerService = TestBed.inject(CustomerService);
      expectedCustomers = [
        { id: 5, type: CustomerType.COMPANY, name: 'Cust 2021', taxNumber: 'NL X 325478745744', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', country: 'Nederland', phone: '035474748', mobile: '0478777855', email: '2021.test@gmail.com', year: 2021, index: 1, number: 'K21.001', foreign: true }
      ] as Customer[];
    });

    it('should return expected customers (called once)', () => {
      customerService.getCustomersOfThisYear().subscribe(
        customers => expect(customers).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      // CustomerService should have made one request to GET customers from expected URL
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock customers
      req.flush(expectedCustomers);
    });

    it('should be OK returning no customers', () => {
      customerService.getCustomersOfThisYear().subscribe(
        customers => expect(customers.length).toEqual(0, 'should have empty customers array'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);
      req.flush([]); // Respond with no customers
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';
      customerService.getCustomersOfThisYear().subscribe(
        customers => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return only customers of this year', () => {
      const customerOfThisYear: Customer = { id: 5, type: CustomerType.COMPANY, name: 'Cust 2021', taxNumber: 'NL X 325478745744', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', country: 'Nederland', phone: '035474748', mobile: '0478777855', email: '2021.test@gmail.com', year: 2021, index: 1, number: 'K21.001', foreign: true }

      expectedCustomers = [
        customerOfThisYear
      ] as Customer[];

      customerService.getCustomersOfThisYear().subscribe(
        customers => expect(customers).toEqual(expectedCustomers, 'should return expected customers'),
        fail
      );

      const requests = httpTestingController.match(customerService.customersUrl);
      expect(requests.length).toEqual(1, 'calls to getCustomersOfThisYear()');

      // Respond with customer of last year (2020) and this year (2021)
      requests[0].flush([
        { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' },
        customerOfThisYear
      ]);
    });
  });

  /// CustomerService method tests begin ///
  describe('#getCustomerNo404', () => {
    // Expecting the query form of URL so should not 404 when id not found
    let expectedCustomer: Customer;

    beforeEach(() => {
      customerService = TestBed.inject(CustomerService);
      expectedCustomer = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' };
    });

    it('should return expected customers (called once)', () => {
      customerService.getCustomerByNumberNo404('K20.001').subscribe(
        customer => expect(customer).toEqual(expectedCustomer, 'should return expected customers'),
        fail
      );

      // CustomerService should have made one request to GET customers from expected URL
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('GET'); 

      // Respond with the mock customers
      req.flush(expectedCustomer);
    });

    it('should be OK returning no customers', () => {
      customerService.getCustomers().subscribe(
        customers => expect(customers.length).toEqual(0, 'should have empty customers array'),
        fail
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);
      req.flush([]); // Respond with no customers
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Deliberate 404';
      customerService.getCustomerByNumberNo404('K20.001').subscribe(
        customers => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected customers (called multiple times)', () => {
      customerService.getCustomers().subscribe();
      customerService.getCustomers().subscribe();
      customerService.getCustomerByNumberNo404('K20.001').subscribe(
        customer => expect(customer).toEqual(expectedCustomer, 'should return expected customers'),
        fail
      );

      const requests = httpTestingController.match(customerService.customersUrl);
      expect(requests.length).toEqual(3, 'calls to getCustomers()');

      // Respond to each request with different mock customer results
      requests[0].flush([]);
      requests[1].flush([{ id: 3, type: CustomerType.COMPANY, name: 'Bedrijf', taxNumber: '0123456789', street: 'Straat', houseNumber: '100', postalCode: '9000', city: 'Gent', phone: '035474748', mobile: '0478777855', email: 'dummy.test@gmail.com', year: 2020, index: 3, number: 'K20.003', foreign: false }]);
      requests[2].flush(expectedCustomer);
    });
  });

  describe('#updateCustomer', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${customerService.customersUrl}/?id=${id}`;

    it('should update a customer and return it', () => {

      const updateCustomer: Customer = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' };

      customerService.updateCustomer(updateCustomer).subscribe(
        data => expect(data).toEqual(updateCustomer, 'should return the customer'),
        fail
      );

      // CustomerService should have made one request to PUT customer
      const req = httpTestingController.expectOne(customerService.customersUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateCustomer);

      // Expect server to return the customer after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateCustomer });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      const msg = 'Deliberate 404';
      const updateCustomer: Customer = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' };
      customerService.updateCustomer(updateCustomer).subscribe(
        customers => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should turn network error into user-facing error', () => {
      const emsg = 'simulated network error';

      const updateCustomer: Customer = { id: 1, type: CustomerType.INDIVIDUAL, name: 'Last First', street: 'Straatnaam', houseNumber: '5', boxNumber: 'a', postalCode: '1000', city: 'Brussel', phone: '035745847', mobile: '0473587477', email: 'mock.test@gmail.com', year: 2020, index: 1, number: 'K20.001', foreign: false, country: '' };
      customerService.updateCustomer(updateCustomer).subscribe(
        customers => fail('expected to fail'),
        error => expect(error.message).toContain(emsg)
      );

      const req = httpTestingController.expectOne(customerService.customersUrl);

      // Create mock ErrorEvent, raised when something goes wrong at the network level.
      // Connection timeout, DNS error, offline, etc
      const errorEvent = new ErrorEvent('so sad', {
        message: emsg,
        // The rest of this is optional and not used.
        // Just showing that you could provide this too.
        filename: 'CustomerService.ts',
        lineno: 42,
        colno: 21
      });

      // Respond with mock error
      req.error(errorEvent);
    });
  });

  // TODO: test other CustomerService methods
});