import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CashReceiptRoutingModule } from "./cash-receipt-routing.module";
import { AddCashReceiptComponent } from "./components/add-cash-receipt/add-cash-receipt.component";
import { EditCashReceiptComponent } from "./components/edit-cash-receipt/edit-cash-receipt.component";
import { ListCashReceiptComponent } from "./components/list-cash-receipt/list-cash-receipt.component";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@NgModule({
  declarations: [
    AddCashReceiptComponent,
    EditCashReceiptComponent,
    ListCashReceiptComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    SharedModule,
    CashReceiptRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModalPopupComponent],
})
export class CashReceiptModule {}
