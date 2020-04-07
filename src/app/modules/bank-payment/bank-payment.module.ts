import { SharedModule } from "./../../shared/shared.module";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankPaymentRoutingModule } from "./bank-payment-routing.module";
import { ListBankPaymentComponent } from "./components/list-bank-payment/list-bank-payment.component";
import { EditBankPaymentComponent } from "./components/edit-bank-payment/edit-bank-payment.component";
import { AddBankPaymentComponent } from "./components/add-bank-payment/add-bank-payment.component";
import { LedgerModalPopupComponent } from "@app/shared/component/ledger-modal-popup/ledger-modal-popup.component";

@NgModule({
  declarations: [
    ListBankPaymentComponent,
    EditBankPaymentComponent,
    AddBankPaymentComponent,
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
    BankPaymentRoutingModule,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModalPopupComponent],
})
export class BankPaymentModule {}
