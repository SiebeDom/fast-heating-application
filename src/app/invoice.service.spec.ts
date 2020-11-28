import { TestBed } from '@angular/core/testing';

import { InvoiceService } from './service/invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
