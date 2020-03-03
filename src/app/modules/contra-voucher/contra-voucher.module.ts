import { InputsModule } from "@progress/kendo-angular-inputs";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContraVoucherRoutingModule } from "./contra-voucher-routing.module";
import { ListContraVoucherComponent } from "./components/list-contra-voucher/list-contra-voucher.component";
import { EditContraVoucherComponent } from "./components/edit-contra-voucher/edit-contra-voucher.component";
import { AddContraVoucherComponent } from "./components/add-contra-voucher/add-contra-voucher.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";
import { PopupModule } from "@progress/kendo-angular-popup";
import {
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@NgModule({
  declarations: [
    ListContraVoucherComponent,
    EditContraVoucherComponent,
    AddContraVoucherComponent
  ],
  imports: [
    CommonModule,
    ContraVoucherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownsModule,
    DropDownListModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModelPopupComponent]
})
export class ContraVoucherModule {}
