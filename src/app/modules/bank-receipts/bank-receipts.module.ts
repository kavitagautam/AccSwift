import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BankReceiptsRoutingModule } from "./bank-receipts-routing.module";
import { ListBankReceiptComponent } from "./components/list-bank-receipt/list-bank-receipt.component";
import { AddBankReceiptComponent } from "./components/add-bank-receipt/add-bank-receipt.component";
import { EditBankReceiptComponent } from "./components/edit-bank-receipt/edit-bank-receipt.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";

@NgModule({
  declarations: [
    ListBankReceiptComponent,
    AddBankReceiptComponent,
    EditBankReceiptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    SharedModule,
    SharedModule,
    BankReceiptsRoutingModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModelPopupComponent]
})
export class BankReceiptsModule {}
