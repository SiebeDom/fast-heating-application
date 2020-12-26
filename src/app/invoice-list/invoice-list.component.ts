import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../model/invoice';
import { InvoiceType } from '../model/invoiceType';
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
  type: InvoiceType;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['number', 'date', 'name'];

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute) {
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

  getCreditNotes(): void {
    this.invoiceService.getCreditNotes()
      .subscribe(creditNotes => {
        this.dataSource = new InvoiceListDataSource(creditNotes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
      });
  }

  selectInvoice(row: any) {
    this.router.navigate(['/template/invoice/edit/' + row.id], { queryParams: { type: this.type } });
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      let type = params['type'];
      if (type === InvoiceType.INVOICE) {
        this.type = InvoiceType.INVOICE;
        this.getinvoices();
      } else {
        this.type = InvoiceType.CREDIT_NOTE;
        this.getCreditNotes();
      }
    });
  }
}
