import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseReturnRoutingModule } from './purchase-return-routing.module';
import { ListPurchaseReturnComponent } from './components/list-purchase-return/list-purchase-return.component';
import { EditPurchaseReturnComponent } from './components/edit-purchase-return/edit-purchase-return.component';
import { AddPurchaseReturnComponent } from './components/add-purchase-return/add-purchase-return.component';

@NgModule({
  declarations: [ListPurchaseReturnComponent, EditPurchaseReturnComponent, AddPurchaseReturnComponent],
  imports: [
    CommonModule,
    PurchaseReturnRoutingModule
  ]
})
export class PurchaseReturnModule { }
