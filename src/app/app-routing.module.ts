import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  { path: 'invoice-print/:id', component: InvoicePrintComponent },
  { path: '', redirectTo: 'navigation', pathMatch: 'full' },
  { path: 'navigation', component: NavigationComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'customers', component: CustomerListComponent },
    { path: 'customer', component: CustomerFormComponent },
    { path: 'customer/:id', component: CustomerFormComponent },
    { path: 'invoices', component: InvoiceListComponent },
    { path: 'invoice', component: InvoiceFormComponent },
    { path: 'invoice/:id', component: InvoiceFormComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }