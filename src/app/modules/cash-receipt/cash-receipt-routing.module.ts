import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddCashReceiptComponent } from "./components/add-cash-receipt/add-cash-receipt.component";
import { ListCashReceiptComponent } from "./components/list-cash-receipt/list-cash-receipt.component";
import { EditCashReceiptComponent } from "./components/edit-cash-receipt/edit-cash-receipt.component";
import { CustomerInvoicesComponent } from "@accSwift-modules/accswift-shared/components/customer-invoices/customer-invoices.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashReceiptComponent,
    data: { breadcrumb: "Cash" },
  },
  {
    path: "add",
    component: AddCashReceiptComponent,
    data: { breadcrumb: "Add Receipts" },
  },
  {
    path: "edit/:id",
    component: EditCashReceiptComponent,
    data: { breadcrumb: "Edit Receipts" },
  },
  {
    path: "edit/:id/invoice-billing",
    component: CustomerInvoicesComponent,
    data: { breadcrumb: "Invoice" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashReceiptRoutingModule {}
