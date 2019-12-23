import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCashPaymentComponent } from "./components/edit-cash-payment/edit-cash-payment.component";
import { AddCashPaymentComponent } from "./components/add-cash-payment/add-cash-payment.component";
import { ListCashPaymentComponent } from "./components/list-cash-payment/list-cash-payment.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashPaymentComponent,
    data: { breadcrumb: " Cash Payment" }
  },
  {
    path: "add",
    component: AddCashPaymentComponent,
    data: { breadcrumb: "Add Payment" }
  },
  {
    path: "edit/:id",
    component: EditCashPaymentComponent,
    data: { breadcrumb: "Edit Payment" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashPaymentsRoutingModule {}
