import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import { Invoice } from '../invoice';
import { InvoiceService } from '../invoice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  customers: Customer[];
  invoice: Invoice = new Invoice();
  invoiceForm = this.fb.group({
    id: [{value: null, disabled: true}, Validators.required],
    date: [null, Validators.required],
    description: [null, Validators.required],
    customerId: [null, Validators.required],
    conditions: [null],
    subTotal: [null, Validators.required],
    vatRate: [null, Validators.required],
    vatAmount: [null, Validators.required],
    total: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    //Edit mode
    if (id != null) {
      this.customerService.getcustomers().subscribe(customers => {
        this.customers = customers;
        this.invoiceService.getinvoice(+id).subscribe(invoice => {
          this.invoice = invoice; 
          this.invoiceForm.setValue({
            id: this.invoice.id,
            date: this.invoice.date,
            customerId: this.invoice.customer.id,
            description: this.invoice.description,
            conditions: this.invoice.conditions,
            subTotal: this.invoice.subTotal,
            vatRate: this.invoice.vatRate,
            vatAmount: this.invoice.vatAmount,
            total: this.invoice.total,
          });
        });
      });
    } else {//Create mode
      this.customerService.getcustomers().subscribe(customers => this.customers = customers);
      this.invoiceForm.patchValue({
        date: this.invoice.date,
      });
    }
  }

  selectCustomer(event) {
    this.customerService.getcustomer(event.source.value).subscribe(customer => this.invoice.customer = customer);
  }

  save(): void {
    //Edit mode
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.description = this.invoiceForm.value.description;
    this.invoice.conditions = this.invoiceForm.value.conditions;
    this.invoice.subTotal = this.invoiceForm.value.subTotal;
    this.invoice.vatRate = this.invoiceForm.value.vatRate;
    this.invoice.vatAmount = this.invoiceForm.value.vatAmount;
    this.invoice.total = this.invoiceForm.value.total;
    if (this.invoice.id != null) {
      this.invoiceService.updateinvoice(this.invoice).subscribe();
    } else {//Create mode
      this.invoiceService.addInvoice(this.invoice).subscribe();
    }
  }

}
