import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReturnRoutingModule } from './sales-return-routing.module';
import { ListSalesReturnComponent } from './components/list-sales-return/list-sales-return.component';
import { AddSalesReturnComponent } from './components/add-sales-return/add-sales-return.component';
import { EditSalesReturnComponent } from './components/edit-sales-return/edit-sales-return.component';

@NgModule({
  declarations: [ListSalesReturnComponent, AddSalesReturnComponent, EditSalesReturnComponent],
  imports: [
    CommonModule,
    SalesReturnRoutingModule
  ]
})
export class SalesReturnModule { }
