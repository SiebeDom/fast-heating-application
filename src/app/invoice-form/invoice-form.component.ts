import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import { Invoice } from '../model/invoice';
import { InvoiceService } from '../service/invoice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VatRate } from '../model/vatRate';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  customers: Customer[];
  invoice: Invoice = new Invoice();
  vatRate = VatRate;
  vatRates = [];
  pad = "000";

  invoiceForm = this.fb.group({
    number: [{ value: null, disabled: true }, Validators.required],
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
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.vatRates = Object.values(this.vatRate);
    let id = this.route.snapshot.paramMap.get('id');
    //Edit mode
    if (id != null) {
      this.customerService.getcustomers().subscribe(customers => {
        this.customers = customers;
        this.invoiceService.getinvoice(+id).subscribe(invoice => {
          this.invoice = invoice;
          this.invoiceForm.setValue({
            number: this.invoice.number,
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

  selectVatRate(event) {
    this.invoice.vatRate = event.source.value;
    this.calculateVatAmountAndTotal();
  }

  calculateVatAmountAndTotal() {
    this.invoice.subTotal = this.invoiceForm.value.subTotal;
    this.invoice.vatRate = this.invoiceForm.value.vatRate;
    if (this.invoice.subTotal != null && this.invoice.vatRate != null) {
      this.invoice.vatAmount = this.invoice.subTotal / 100 * +this.invoice.vatRate;
      this.invoice.total = +this.invoice.subTotal + +this.invoice.vatAmount;
      this.invoiceForm.patchValue({
        vatAmount: this.invoice.vatAmount,
        total: this.invoice.total,
      });
    }
  }

  save(): void {
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.description = this.invoiceForm.value.description;
    this.invoice.conditions = this.invoiceForm.value.conditions;
    this.invoice.subTotal = this.invoiceForm.value.subTotal;
    this.invoice.vatRate = this.invoiceForm.value.vatRate;
    this.invoice.vatAmount = this.invoiceForm.value.vatAmount;
    this.invoice.total = this.invoiceForm.value.total;
    //Edit mode
    if (this.invoice.id != null) {
      this.invoiceService.updateInvoice(this.invoice).subscribe();
    } else {//Create mode
      this.invoice.year = new Date().getFullYear();
      this.invoiceService.getInvoicesOfThisYear().subscribe(invoices => {
        this.invoice.index = invoices.length > 0 ? Math.max(...invoices.map(t => t.index)) + 1 : 1;
        this.invoice.number = "F" + this.invoice.year.toString().substr(this.invoice.year.toString().length - 2) + (this.pad+this.invoice.index.toString()).slice(-this.pad.length);
        this.invoiceService.addInvoice(this.invoice).subscribe(invoice => {
          this.invoice = invoice;
          this.invoiceForm.patchValue({
            number: this.invoice.number,
          });
        });
      });
    }
  }

  print(): void {
    this.router.navigate(['invoice/print/' + this.invoice.id]);
  }

}
