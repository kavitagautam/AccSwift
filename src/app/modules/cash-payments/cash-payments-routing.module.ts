import { AddCashPaymentsComponent } from "./components/add-cash-payments/add-cash-payments.component";
import { ListCashPaymentsComponent } from "./components/list-cash-payments/list-cash-payments.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCashPaymentsComponent } from "./components/edit-cash-payments/edit-cash-payments.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashPaymentsComponent,
    data: { breadcrumb: " Cash Payments" }
  },
  {
    path: "add",
    component: AddCashPaymentsComponent,
    data: { breadcrumb: "Add  Payments" }
  },
  {
    path: "edit/:id",
    component: EditCashPaymentsComponent,
    data: { breadcrumb: "Edit  Payments" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashPaymentsRoutingModule {}
