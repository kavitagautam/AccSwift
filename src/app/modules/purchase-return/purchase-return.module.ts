import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SharedModule } from "./../../shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseReturnRoutingModule } from "./purchase-return-routing.module";
import { ListPurchaseReturnComponent } from "./components/list-purchase-return/list-purchase-return.component";
import { EditPurchaseReturnComponent } from "./components/edit-purchase-return/edit-purchase-return.component";
import { AddPurchaseReturnComponent } from "./components/add-purchase-return/add-purchase-return.component";
import { InputsModule } from "@progress/kendo-angular-inputs";

@NgModule({
  declarations: [
    ListPurchaseReturnComponent,
    EditPurchaseReturnComponent,
    AddPurchaseReturnComponent
  ],
  imports: [
    CommonModule,
    PurchaseReturnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    DropDownListModule,
    DropDownsModule,
    InputsModule,
    SharedModule
  ]
})
export class PurchaseReturnModule { }
