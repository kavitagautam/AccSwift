import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddCashReceiptComponent } from "./components/add-cash-receipt/add-cash-receipt.component";
import { ListCashReceiptComponent } from "./components/list-cash-receipt/list-cash-receipt.component";
import { EditCashReceiptComponent } from "./components/edit-cash-receipt/edit-cash-receipt.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashReceiptComponent,
    data: { breadcrumb: "Cash" }
  },
  {
    path: "add",
    component: AddCashReceiptComponent,
    data: { breadcrumb: "Add Cash Receipts" }
  },
  {
    path: "edit",
    component: EditCashReceiptComponent,
    data: { breadcrumb: "Edit Cash Receipts" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashReceiptsRoutingModule {}
