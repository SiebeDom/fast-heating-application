import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
      Validators.required, Validators.minLength(4), Validators.maxLength(4)])
    ],
  });

  customer: Customer;

  hasUnitNumber = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    //Edit mode
    if (id != null) {
      this.customerService.getcustomer(+id).subscribe(customer => this.customer = customer);
    } else {//Create mode
      this.customer = new Customer();
    }
  }

  save(): void {
    //Edit mode
    if (this.customer.id != null) {
      this.customerService.updatecustomer(this.customer).subscribe();
    } else {//Create mode
      this.customerService.addCustomer(this.customer).subscribe();    
    }
  }

  delete(): void {
    this.customerService.deletecustomer(this.customer).subscribe();
  }
}
