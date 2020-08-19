import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesInvoiceRoutingModule } from "./sales-invoice-routing.module";
import { ListSalesInvoiceComponent } from "./components/list-sales-invoice/list-sales-invoice.component";
import { AddSalesInvoiceComponent } from "./components/add-sales-invoice/add-sales-invoice.component";
import { EditSalesInvoiceComponent } from "./components/edit-sales-invoice/edit-sales-invoice.component";
import { ProductModalPopupComponent } from "@accSwift-modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { CashPartyModalPopupComponent } from "@accSwift-modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { CustomerInvoicesComponent } from "./components/customer-invoices/customer-invoices.component";
import { NgxPrintModule } from "ngx-print";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { SharedModule } from "@app/shared/shared.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AddProductComponent } from "@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";
import { AccswiftFormsModule } from "../accswift-forms/accswift-forms.module";

@NgModule({
  declarations: [
    ListSalesInvoiceComponent,
    AddSalesInvoiceComponent,
    EditSalesInvoiceComponent,
    CustomerInvoicesComponent,
  ],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule,
    FormsModule,
    SharedModule,
    AccswiftSharedModule,
    ReactiveFormsModule,
    NgxPrintModule,
    GridModule,
    PopupModule,
    DragDropModule,
    PDFExportModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    AccswiftFormsModule,
  ],
  entryComponents: [
    ProductModalPopupComponent,
    CashPartyModalPopupComponent,
    AddProductComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesInvoiceModule {}
