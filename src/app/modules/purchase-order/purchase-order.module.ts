import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { ListPurchaseOrderComponent } from './components/list-purchase-order/list-purchase-order.component';
import { EditPurchaseOrderComponent } from './components/edit-purchase-order/edit-purchase-order.component';
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';

@NgModule({
  declarations: [ListPurchaseOrderComponent, EditPurchaseOrderComponent, AddPurchaseOrderComponent],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule
  ]
})
export class PurchaseOrderModule { }
