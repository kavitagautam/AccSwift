import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BankPaymentRoutingModule } from "./bank-payment-routing.module";
import { ListBankPaymentComponent } from "./components/list-bank-payment/list-bank-payment.component";
import { EditBankPaymentComponent } from "./components/edit-bank-payment/edit-bank-payment.component";
import { AddBankPaymentComponent } from "./components/add-bank-payment/add-bank-payment.component";
import { LedgerModalPopupComponent } from "@app/modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { SharedModule } from "@app/shared/shared.module";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

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
    AccswiftSharedModule,
    DateInputsModule,
    BankPaymentRoutingModule,
  ],
  entryComponents: [LedgerModalPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankPaymentModule {}
