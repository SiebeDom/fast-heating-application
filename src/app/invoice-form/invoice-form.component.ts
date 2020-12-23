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
  customerId: number;
  invoiceAction: string;
  invoiceDate: Date;
  invoiceDescription: string;
  invoiceConditions: string;
  invoiceSubTotal: number;
  invoiceVatAmount: number;
  invoiceVatRate: number;
  invoiceTotal: number;

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
    this.customerId = +this.route.snapshot.paramMap.get('customerId');
    this.invoiceAction = this.route.snapshot.paramMap.get('invoiceAction');
    this.invoiceDate = this.route.snapshot.paramMap.get('invoiceDate') != null ? new Date(this.route.snapshot.paramMap.get('invoiceDate')): null;
    this.invoiceDescription = this.route.snapshot.paramMap.get('invoiceDescription');
    this.invoiceConditions = this.route.snapshot.paramMap.get('invoiceConditions');
    this.invoiceSubTotal = +this.route.snapshot.paramMap.get('invoiceSubTotal');
    this.invoiceVatRate = +this.route.snapshot.paramMap.get('invoiceVatRate');
    this.invoiceVatAmount = +this.route.snapshot.paramMap.get('invoiceVatAmount');
    this.invoiceTotal = +this.route.snapshot.paramMap.get('invoiceTotal');
    //Edit mode
    if (id != null) {
      this.customerService.getcustomers().subscribe(customers => {
        this.customers = customers;
        this.invoiceService.getinvoice(+id).subscribe(invoice => {
          this.invoice = invoice;
          console.log(this.invoiceDescription);
          this.invoiceForm.setValue({
            number: this.invoice.number,
            date: this.invoiceDate != null ? this.invoiceDate : this.invoice.date,
            customerId: this.customerId != 0 ? this.customerId : this.invoice.customer.id,
            description: this.invoiceDescription != null ? this.invoiceDescription : this.invoice.description,
            conditions: this.invoiceConditions != null ? this.invoiceConditions : this.invoice.conditions,
            subTotal: this.invoiceSubTotal != 0 ? this.invoiceSubTotal : this.invoice.subTotal,
            vatRate: this.invoiceVatRate != 0 ? this.invoiceVatRate : this.invoice.vatRate,
            vatAmount: this.invoiceVatAmount != 0 ? this.invoiceVatAmount : this.invoice.vatAmount,
            total: this.invoiceTotal != 0 ? this.invoiceTotal : this.invoice.total,
          });
          if(this.customerId != 0){
            this.customerService.getcustomer(this.customerId).subscribe(customer => this.invoice.customer = customer);
          }
        });
      });
    } else {//Create mode
      this.customerService.getcustomers().subscribe(customers => this.customers = customers);
      this.invoiceForm.patchValue({
        date: this.invoice.date,
        customerId: this.customerId != 0 ? this.customerId : this.invoice.customer.id,
        description: this.invoiceDescription != null ? this.invoiceDescription : this.invoice.description,
        conditions: this.invoiceConditions != null ? this.invoiceConditions : this.invoice.conditions,
        subTotal: this.invoiceSubTotal != 0 ? this.invoiceSubTotal : this.invoice.subTotal,
        vatRate: this.invoiceVatRate != 0 ? this.invoiceVatRate : this.invoice.vatRate,
        vatAmount: this.invoiceVatAmount != 0 ? this.invoiceVatAmount : this.invoice.vatAmount,
        total: this.invoiceTotal != 0 ? this.invoiceTotal : this.invoice.total,
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
        this.invoice.number = "F" + this.invoice.year.toString().substr(this.invoice.year.toString().length - 2) + " " + (this.pad+this.invoice.index.toString()).slice(-this.pad.length);
        this.invoiceService.addInvoice(this.invoice).subscribe(invoice => {
          this.invoice = invoice;
          this.invoiceForm.patchValue({
            number: this.invoice.number,
          });
        });
      });
    }
  }

  newCustomer() {
    this.router.navigate(['/template/customer/new', {
      invoiceAction : this.invoice.id === undefined ? 'new' : 'edit',
      invoiceId : this.invoice.id,
      invoiceDate : this.invoiceForm.value.date,
      invoiceDescription : this.invoiceForm.value.description,
      invoiceConditions : this.invoiceForm.value.conditions,
      invoiceSubTotal : this.invoiceForm.value.subTotal,
      invoiceVatAmount : this.invoiceForm.value.vatAmount,
      invoiceVatRate : this.invoiceForm.value.vatRate,
      invoiceTotal : this.invoiceForm.value.total,
    }]);
  }

  editCustomer() {
    this.router.navigate(['/template/customer/edit/' + this.invoice.customer.id, {
      invoiceAction : this.invoice.id === undefined ? 'new' : 'edit',
      invoiceId : this.invoice.id,
      invoiceDate : this.invoiceForm.value.date,
      invoiceDescription : this.invoiceForm.value.description,
      invoiceConditions : this.invoiceForm.value.conditions,
      invoiceSubTotal : this.invoiceForm.value.subTotal,
      invoiceVatAmount : this.invoiceForm.value.vatAmount,
      invoiceVatRate : this.invoiceForm.value.vatRate,
      invoiceTotal : this.invoiceForm.value.total,
    }]);  
  }

  print(): void {
    this.router.navigate(['invoice/print/' + this.invoice.id]);
  }

}
