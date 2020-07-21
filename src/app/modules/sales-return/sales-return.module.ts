import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";

import { SalesReturnRoutingModule } from "./sales-return-routing.module";
import { ListSalesReturnComponent } from "./components/list-sales-return/list-sales-return.component";
import { AddSalesReturnComponent } from "./components/add-sales-return/add-sales-return.component";
import { EditSalesReturnComponent } from "./components/edit-sales-return/edit-sales-return.component";
import { CashPartyModalPopupComponent } from "@app/modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { ProductModalPopupComponent } from "@app/modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [
    ListSalesReturnComponent,
    AddSalesReturnComponent,
    EditSalesReturnComponent,
  ],
  imports: [
    CommonModule,
    SalesReturnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    DropDownListModule,
    DropDownsModule,
    InputsModule,
    SharedModule,
    AccswiftSharedModule,
  ],
  entryComponents: [CashPartyModalPopupComponent, ProductModalPopupComponent],
})
export class SalesReturnModule {}
