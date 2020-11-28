import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Customer } from '../model/customer';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent {
  customerForm = this.fb.group({
    id: [{value: null, disabled: true}, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    street: [null, Validators.required],
    houseNumber: [null, Validators.required],
    boxNumber: null,
    city: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(4), Validators.maxLength(4)])
    ],
  });

  customer: Customer;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    //Edit mode
    if (id != null) {
      this.customerService.getcustomer(+id).subscribe(customer => {
        this.customer = customer; 
        this.customerForm.setValue({
          id: this.customer.id,
          firstName: this.customer.firstName,
          lastName: this.customer.lastName,
          street: this.customer.street,
          houseNumber: this.customer.houseNumber,
          boxNumber: this.customer.boxNumber,
          postalCode: this.customer.postalCode,
          city: this.customer.city,
        });
      });
    } else {//Create mode
      this.customer = new Customer();
    }
  }

  save(): void {
    this.customer.firstName = this.customerForm.value.firstName;
    this.customer.lastName = this.customerForm.value.lastName;
    this.customer.street = this.customerForm.value.street;
    this.customer.houseNumber = this.customerForm.value.houseNumber;
    this.customer.boxNumber = this.customerForm.value.boxNumber;
    this.customer.postalCode = this.customerForm.value.postalCode;
    this.customer.city = this.customerForm.value.city;
    //Edit mode
    if (this.customer.id != null) {
      this.customerService.updatecustomer(this.customer).subscribe();
    } else {//Create mode
      this.customerService.addCustomer(this.customer).subscribe(customer => {
        this.customer = customer; 
        this.customerForm.patchValue({
          id: this.customer.id,
        });
      });  
    }
  }

  delete(): void {
    this.customerService.deletecustomer(this.customer).subscribe();
  }
}
