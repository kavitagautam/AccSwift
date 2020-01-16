import {
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "./../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesInvoiceRoutingModule } from "./sales-invoice-routing.module";
import { ListSalesInvoiceComponent } from "./components/list-sales-invoice/list-sales-invoice.component";
import { AddSalesInvoiceComponent } from "./components/add-sales-invoice/add-sales-invoice.component";
import { EditSalesInvoiceComponent } from "./components/edit-sales-invoice/edit-sales-invoice.component";

@NgModule({
  declarations: [
    ListSalesInvoiceComponent,
    AddSalesInvoiceComponent,
    EditSalesInvoiceComponent
  ],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule
  ]
})
export class SalesInvoiceModule {}
