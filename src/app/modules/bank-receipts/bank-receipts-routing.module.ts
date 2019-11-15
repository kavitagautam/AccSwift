import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankReceiptComponent } from "./components/list-bank-receipt/list-bank-receipt.component";
import { AddBankReceiptComponent } from "./components/add-bank-receipt/add-bank-receipt.component";
import { EditBankReceiptComponent } from "./components/edit-bank-receipt/edit-bank-receipt.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankReceiptComponent,
    data: { breadcrumb: "List Bank Receipts" }
  },
  {
    path: "add",
    component: AddBankReceiptComponent,
    data: { breadcrumb: "Add Bank Receipts" }
  },
  {
    path: "edit",
    component: EditBankReceiptComponent,
    data: { breadcrumb: "Edit Bank Receipts" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReceiptsRoutingModule {}
