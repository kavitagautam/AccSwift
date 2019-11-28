import { AddCashPaymentsComponent } from "./components/add-cash-payments/add-cash-payments.component";
import { ListCashPaymentsComponent } from "./components/list-cash-payments/list-cash-payments.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCashPaymentsComponent } from "./components/edit-cash-payments/edit-cash-payments.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashPaymentsComponent,
    data: { breadcrumb: "List Cash Payments" }
  },
  {
    path: "add",
    component: AddCashPaymentsComponent,
    data: { breadcrumb: "Add Cash Payments" }
  },
  {
    path: "edit",
    component: EditCashPaymentsComponent,
    data: { breadcrumb: "Edit Cash Payments" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashPaymentsRoutingModule {}
