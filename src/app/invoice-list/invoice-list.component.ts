import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { Invoice } from '../model/invoice';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceListDataSource } from './invoice-list-datasource';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Invoice>;
  dataSource: InvoiceListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName'];

  constructor(
    private invoiceService: InvoiceService,
    private router: Router) {
    this.invoiceService = invoiceService;
  }

  getinvoices(): void {
    this.invoiceService.getinvoices()
      .subscribe(invoices => {
        this.dataSource = new InvoiceListDataSource(invoices);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
      });
  }

  selectInvoice(row: any) {
    this.router.navigate(['/template/invoice/edit/' + row.id]);
  }

  ngAfterViewInit() {
    this.getinvoices();
  }
}
