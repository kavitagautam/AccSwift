import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseInvoiceRoutingModule } from "./purchase-invoice-routing.module";
import { AddPurchaseInvoiceComponent } from "./components/add-purchase-invoice/add-purchase-invoice.component";
import { EditPurchaseInvoiceComponent } from "./components/edit-purchase-invoice/edit-purchase-invoice.component";
import { ListPurchaseInvoiceComponent } from "./components/list-purchase-invoice/list-purchase-invoice.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [
    AddPurchaseInvoiceComponent,
    EditPurchaseInvoiceComponent,
    ListPurchaseInvoiceComponent
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PurchaseInvoiceModule {}
