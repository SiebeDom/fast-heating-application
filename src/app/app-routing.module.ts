import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoicePrintComponent } from './invoice-print/invoice-print.component';
import { LoginComponent } from './login/login.component';
import { LoginActiveGuard } from './service/login-active.guard';
import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  //Display invoice print full screen (we don't want a menu on the invoice PDF of print)
  { path: 'invoice/print/:id', component: InvoicePrintComponent, canActivate:[LoginActiveGuard]},
  { path: 'login', component: LoginComponent },
  //Display the application screens in the template
  { path: '', redirectTo: 'template', pathMatch: 'full', canActivate:[LoginActiveGuard]},
  { path: 'template', component: TemplateComponent, children: [
    { path: '', component: DashboardComponent , canActivate:[LoginActiveGuard]},
    { path: 'dashboard', component: DashboardComponent , canActivate:[LoginActiveGuard]},
    { path: 'customer/list', component: CustomerListComponent , canActivate:[LoginActiveGuard]},
    { path: 'customer/new', component: CustomerFormComponent , canActivate:[LoginActiveGuard]},
    { path: 'customer/edit/:id', component: CustomerFormComponent, canActivate:[LoginActiveGuard] },
    { path: 'invoice/list', component: InvoiceListComponent, canActivate:[LoginActiveGuard] },
    { path: 'invoice/new', component: InvoiceFormComponent, canActivate:[LoginActiveGuard] },
    { path: 'invoice/edit/:id', component: InvoiceFormComponent, canActivate:[LoginActiveGuard] },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }