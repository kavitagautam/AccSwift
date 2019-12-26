import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { ListSalesOrderComponent } from './components/list-sales-order/list-sales-order.component';
import { AddSalesOrderComponent } from './components/add-sales-order/add-sales-order.component';
import { EditSalesOrderComponent } from './components/edit-sales-order/edit-sales-order.component';

@NgModule({
  declarations: [ListSalesOrderComponent, AddSalesOrderComponent, EditSalesOrderComponent],
  imports: [
    CommonModule,
    SalesOrderRoutingModule
  ]
})
export class SalesOrderModule { }
