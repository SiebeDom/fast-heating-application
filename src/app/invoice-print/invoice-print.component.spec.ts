import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InvoicePrintComponent } from './invoice-print.component';

describe('InvoicePrintComponent', () => {
  let component: InvoicePrintComponent;
  let fixture: ComponentFixture<InvoicePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePrintComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule, 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
