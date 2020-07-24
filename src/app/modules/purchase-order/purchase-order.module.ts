import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PurchaseOrderRoutingModule } from "./purchase-order-routing.module";
import { ListPurchaseOrderComponent } from "./components/list-purchase-order/list-purchase-order.component";
import { EditPurchaseOrderComponent } from "./components/edit-purchase-order/edit-purchase-order.component";
import { AddPurchaseOrderComponent } from "./components/add-purchase-order/add-purchase-order.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { SharedModule } from "@app/shared/shared.module";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { ProductModalPopupComponent } from "@accSwift-modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [
    ListPurchaseOrderComponent,
    EditPurchaseOrderComponent,
    AddPurchaseOrderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    SharedModule,
    AccswiftSharedModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    PurchaseOrderRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ProductModalPopupComponent],
})
export class PurchaseOrderModule {}
