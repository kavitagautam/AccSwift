import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankReceiptsRoutingModule } from "./bank-receipts-routing.module";
import { ListBankReceiptComponent } from "./components/list-bank-receipt/list-bank-receipt.component";
import { AddBankReceiptComponent } from "./components/add-bank-receipt/add-bank-receipt.component";
import { EditBankReceiptComponent } from "./components/edit-bank-receipt/edit-bank-receipt.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";

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
    SharedModule,
    BankReceiptsRoutingModule
  ]
})
export class BankReceiptsModule {}
