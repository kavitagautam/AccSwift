import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashReceiptsRoutingModule } from './cash-receipts-routing.module';
import { AddCashReceiptComponent } from './components/add-cash-receipt/add-cash-receipt.component';
import { EditCashReceiptComponent } from './components/edit-cash-receipt/edit-cash-receipt.component';
import { ListCashReceiptComponent } from './components/list-cash-receipt/list-cash-receipt.component';

@NgModule({
  declarations: [AddCashReceiptComponent, EditCashReceiptComponent, ListCashReceiptComponent],
  imports: [
    CommonModule,
    CashReceiptsRoutingModule
  ]
})
export class CashReceiptsModule { }
