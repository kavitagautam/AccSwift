import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesInvoiceRoutingModule } from './sales-invoice-routing.module';
import { ListSalesInvoiceComponent } from './components/list-sales-invoice/list-sales-invoice.component';
import { AddSalesInvoiceComponent } from './components/add-sales-invoice/add-sales-invoice.component';
import { EditSalesInvoiceComponent } from './components/edit-sales-invoice/edit-sales-invoice.component';

@NgModule({
  declarations: [ListSalesInvoiceComponent, AddSalesInvoiceComponent, EditSalesInvoiceComponent],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule
  ]
})
export class SalesInvoiceModule { }
