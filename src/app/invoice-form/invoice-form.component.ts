import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  customers: Customer[];
  invoice: Invoice = new Invoice();
  invoiceForm = this.fb.group({
    date: [null, Validators.required],
    subTotal: [null, Validators.required],
    vatRate: [null, Validators.required],
    vatAmount: [null, Validators.required],
    total: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.customerService.getcustomers().subscribe(customers => this.customers = customers);
  }

  selectCustomer(event) {
    this.customerService.getcustomer(event.source.value).subscribe(customer => this.invoice.customer = customer);
  }

}
