import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  dataSource;

  displayedColumns: string[] = ['id', 'firstName', 'lastName'];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.getcustomers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getcustomers(): void {
    this.customerService.getcustomers()
    .subscribe(customers =>  this.dataSource = new MatTableDataSource(customers));
  }

  delete(customer: Customer): void {
    this.customerService.deletecustomer(customer).subscribe();
    this.getcustomers();
  }
}
