import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCashPaymentComponent } from "./components/edit-cash-payment/edit-cash-payment.component";
import { AddCashPaymentComponent } from "./components/add-cash-payment/add-cash-payment.component";
import { ListCashPaymentComponent } from "./components/list-cash-payment/list-cash-payment.component";
import { CustomerInvoicesComponent } from "@accSwift-modules/accswift-shared/components/customer-invoices/customer-invoices.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashPaymentComponent,
    data: { breadcrumb: " Cash Payment" },
  },
  {
    path: "add",
    component: AddCashPaymentComponent,
    data: { breadcrumb: "Add Payment" },
  },
  {
    path: "edit/:id",
    component: EditCashPaymentComponent,
    data: { breadcrumb: "Edit Payment" },
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
export class CashPaymentsRoutingModule {}
