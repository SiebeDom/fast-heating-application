import { Component, OnInit } from '@angular/core';
import { Customer } from '../model/customer';
import { CustomerService } from '../service/customer.service';
import { Invoice } from '../model/invoice';
import { InvoiceService } from '../service/invoice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VatRate } from '../model/vatRate';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  customers: Customer[];
  invoice: Invoice;
  customer: Customer;
  vatRate = VatRate;
  vatRates = Object.values(this.vatRate);
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
    this.invoice = new Invoice();
    this.customer = new Customer()

    let id = this.route.snapshot.paramMap.get('id');

    //Get data from the URL when returning from the customer form
    let customerId = +this.route.snapshot.paramMap.get('customerId');
    let invoiceDate = this.route.snapshot.paramMap.get('invoiceDate') != null ? new Date(this.route.snapshot.paramMap.get('invoiceDate')) : null;
    let invoiceDescription = this.route.snapshot.paramMap.get('invoiceDescription');
    let invoiceConditions = this.route.snapshot.paramMap.get('invoiceConditions');
    let invoiceSubTotal = +this.route.snapshot.paramMap.get('invoiceSubTotal');
    let invoiceVatRate = +this.route.snapshot.paramMap.get('invoiceVatRate');
    let invoiceVatAmount = +this.route.snapshot.paramMap.get('invoiceVatAmount');
    let invoiceTotal = +this.route.snapshot.paramMap.get('invoiceTotal');

    //Get a list of all the customers to be shown in the dropdown
    this.customerService.getcustomers().subscribe(customers => {
      this.customers = customers;
    });

    //Edit mode
    if (id != null) {
      this.invoiceService.getinvoice(+id).subscribe(invoice => {
        this.invoice = invoice;
        this.fillForm(invoice);
        this.restoreUnsavedData(customerId, invoiceDate, invoiceDescription, invoiceConditions, invoiceSubTotal, invoiceVatRate, invoiceVatAmount, invoiceTotal);
      });
    } else {//Create mode
      this.restoreUnsavedData(customerId, invoiceDate, invoiceDescription, invoiceConditions, invoiceSubTotal, invoiceVatRate, invoiceVatAmount, invoiceTotal);
    }
  }

  /**
   * Fill the invoice form with the values from the retrieved invoice
   * @param invoice the values of this invoice will be used to fill the form
   */
  fillForm(invoice: Invoice) {
    this.invoiceForm.setValue({
      number: invoice.number,
      date: invoice.date,
      customerId: invoice.customer.id,
      description: invoice.description,
      conditions: invoice.conditions,
      subTotal: invoice.subTotal,
      vatRate: invoice.vatRate,
      vatAmount: invoice.vatAmount,
      total: invoice.total,
    });
    this.customerService.getcustomer(invoice.customer.id).subscribe(customer => this.customer = customer);
  }

  /**
   * Restore unsaved data.
   * When returning from the customer form. Unsaved data is restored.
   */
  restoreUnsavedData(customerId: number,
    invoiceDate: Date,
    invoiceDescription: string,
    invoiceConditions: string,
    invoiceSubTotal: number,
    invoiceVatRate: number,
    invoiceVatAmount: number,
    invoiceTotal: number) {
    if (customerId != 0) {
      this.invoiceForm.patchValue({
        customerId: customerId
      })
      this.customerService.getcustomer(customerId).subscribe(customer => this.customer = customer);
    }
    if (invoiceDate != null) {
      this.invoiceForm.patchValue({
        date: invoiceDate
      })
    }
    if (invoiceDescription != null) {
      this.invoiceForm.patchValue({
        description: invoiceDescription
      })
    }
    if (invoiceConditions != null) {
      this.invoiceForm.patchValue({
        conditions: invoiceConditions
      })
    }
    if (invoiceSubTotal != 0) {
      this.invoiceForm.patchValue({
        subTotal: invoiceSubTotal
      })
    }
    if (invoiceVatRate != 0) {
      this.invoiceForm.patchValue({
        vatRate: invoiceVatRate
      })
    }
    if (invoiceVatAmount != 0) {
      this.invoiceForm.patchValue({
        vatAmount: invoiceVatAmount
      })
    }
    if (invoiceTotal != 0) {
      this.invoiceForm.patchValue({
        total: invoiceTotal
      })
    }
  }

  selectCustomer(event) {
    this.customerService.getcustomer(event.source.value).subscribe(customer => this.customer = customer);
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
    this.invoice.customer = this.customer;
    //Edit mode
    if (this.invoice.id != null) {
      this.invoiceService.updateInvoice(this.invoice).subscribe();
    } else {//Create mode
      this.invoice.year = new Date().getFullYear();
      this.invoiceService.getInvoicesOfThisYear().subscribe(invoices => {
        this.invoice.index = invoices.length > 0 ? Math.max(...invoices.map(t => t.index)) + 1 : 1;
        this.invoice.number = "F" + this.invoice.year.toString().substr(this.invoice.year.toString().length - 2) + " " + (this.pad + this.invoice.index.toString()).slice(-this.pad.length);
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
    this.goToCustomer('new');
  }

  editCustomer() {
    this.goToCustomer('edit');
  }

  goToCustomer(customerAction:string){
    const formatedInvoiceDate = new DatePipe('en-US').transform(this.invoiceForm.value.date, 'short');
    this.router.navigate(['/template/customer/' + customerAction + '/' + (customerAction === 'new' ? '' : this.customer.id), {
      invoiceAction: this.invoice.id === undefined ? 'new' : 'edit',
      invoiceId: this.invoice.id,
      invoiceDate: formatedInvoiceDate,
      invoiceDescription: this.invoiceForm.value.description,
      invoiceConditions: this.invoiceForm.value.conditions,
      invoiceSubTotal: this.invoiceForm.value.subTotal,
      invoiceVatAmount: this.invoiceForm.value.vatAmount,
      invoiceVatRate: this.invoiceForm.value.vatRate,
      invoiceTotal: this.invoiceForm.value.total,
    }]);
  }

  print(): void {
    this.router.navigate(['invoice/print/' + this.invoice.id]);
  }

}
