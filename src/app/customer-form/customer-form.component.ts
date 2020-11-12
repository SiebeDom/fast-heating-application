import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {
  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    street: [null, Validators.required],
    houseNumber: [null, Validators.required],
    boxNumber: null,
    address2: null,
    city: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  });

  customer: Customer;

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customer = new Customer();
  }

  add(): void {
    console.log(this.customer);
    this.customerService.addCustomer(this.customer)
      .subscribe();
  }
}
