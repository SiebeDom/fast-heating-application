import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../model/customer';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  @Input()
  customer: Customer = new Customer();
  
  constructor() { }

  ngOnInit(): void {
  }

}
