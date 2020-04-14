import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesOrderRoutingModule } from "./sales-order-routing.module";
import { ListSalesOrderComponent } from "./components/list-sales-order/list-sales-order.component";
import { AddSalesOrderComponent } from "./components/add-sales-order/add-sales-order.component";
import { EditSalesOrderComponent } from "./components/edit-sales-order/edit-sales-order.component";

@NgModule({
  declarations: [
    ListSalesOrderComponent,
    AddSalesOrderComponent,
    EditSalesOrderComponent,
  ],
  imports: [
    CommonModule,
    SalesOrderRoutingModule,
    SharedModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ],
})
export class SalesOrderModule {}
