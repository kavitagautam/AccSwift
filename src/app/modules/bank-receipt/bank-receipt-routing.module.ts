import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankReceiptComponent } from "./components/list-bank-receipt/list-bank-receipt.component";
import { AddBankReceiptComponent } from "./components/add-bank-receipt/add-bank-receipt.component";
import { EditBankReceiptComponent } from "./components/edit-bank-receipt/edit-bank-receipt.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankReceiptComponent,
    data: { breadcrumb: "Bank Receipt" }
  },
  {
    path: "add",
    component: AddBankReceiptComponent,
    data: { breadcrumb: "Add Receipt" }
  },
  {
    path: "edit/:id",
    component: EditBankReceiptComponent,
    data: { breadcrumb: "Edit Receipt" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReceiptRoutingModule {}
