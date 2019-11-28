import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankReceiptComponent } from "./components/list-bank-receipt/list-bank-receipt.component";
import { AddBankReceiptComponent } from "./components/add-bank-receipt/add-bank-receipt.component";
import { EditBankReceiptComponent } from "./components/edit-bank-receipt/edit-bank-receipt.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankReceiptComponent,
    data: { breadcrumb: "Bank Receipts" }
  },
  {
    path: "add",
    component: AddBankReceiptComponent,
    data: { breadcrumb: "Add Receipts" }
  },
  {
    path: "edit",
    component: EditBankReceiptComponent,
    data: { breadcrumb: "Edit Receipts" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReceiptsRoutingModule {}
