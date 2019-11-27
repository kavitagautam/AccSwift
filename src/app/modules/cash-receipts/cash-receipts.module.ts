import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CashReceiptsRoutingModule } from "./cash-receipts-routing.module";
import { AddCashReceiptComponent } from "./components/add-cash-receipt/add-cash-receipt.component";
import { EditCashReceiptComponent } from "./components/edit-cash-receipt/edit-cash-receipt.component";
import { ListCashReceiptComponent } from "./components/list-cash-receipt/list-cash-receipt.component";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";

@NgModule({
  declarations: [
    AddCashReceiptComponent,
    EditCashReceiptComponent,
    ListCashReceiptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    CashReceiptsRoutingModule
  ]
})
export class CashReceiptsModule {}
