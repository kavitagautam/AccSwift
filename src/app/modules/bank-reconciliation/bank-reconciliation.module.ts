import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankReconciliationRoutingModule } from "./bank-reconciliation-routing.module";
import { ListBankReconciliationComponent } from "./components/list-bank-reconciliation/list-bank-reconciliation.component";
import { AddBankReconciliationComponent } from "./components/add-bank-reconciliation/add-bank-reconciliation.component";
import { EditBankReconciliationComponent } from "./components/edit-bank-reconciliation/edit-bank-reconciliation.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [
    ListBankReconciliationComponent,
    AddBankReconciliationComponent,
    EditBankReconciliationComponent,
  ],
  imports: [
    CommonModule,
    BankReconciliationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    AccswiftSharedModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModalPopupComponent],
})
export class BankReconciliationModule {}
