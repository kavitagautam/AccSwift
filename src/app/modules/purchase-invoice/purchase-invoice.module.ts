import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { AddPurchaseInvoiceComponent } from './components/add-purchase-invoice/add-purchase-invoice.component';
import { EditPurchaseInvoiceComponent } from './components/edit-purchase-invoice/edit-purchase-invoice.component';
import { ListPurchaseInvoiceComponent } from './components/list-purchase-invoice/list-purchase-invoice.component';

@NgModule({
  declarations: [AddPurchaseInvoiceComponent, EditPurchaseInvoiceComponent, ListPurchaseInvoiceComponent],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule
  ]
})
export class PurchaseInvoiceModule { }
