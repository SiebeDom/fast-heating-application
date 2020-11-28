import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  //Display invoice print full screen (we don't want a menu on the invoice PDF of print)
  { path: 'invoice/print/:id', component: InvoicePrintComponent },
  //Display the application screens in the template
  { path: '', redirectTo: 'template', pathMatch: 'full' },
  { path: 'template', component: TemplateComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'customer/list', component: CustomerListComponent },
    { path: 'customer/new', component: CustomerFormComponent },
    { path: 'customer/edit/:id', component: CustomerFormComponent },
    { path: 'invoice/list', component: InvoiceListComponent },
    { path: 'invoice/new', component: InvoiceFormComponent },
    { path: 'invoice/edit/:id', component: InvoiceFormComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }