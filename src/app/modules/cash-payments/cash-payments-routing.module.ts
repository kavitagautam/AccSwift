import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditCashPaymentsComponent } from "./components/edit-cash-payments/edit-cash-payments.component";
import { AddCashPaymentsComponent } from "./components/add-cash-payments/add-cash-payments.component";
import { ListCashPaymentsComponent } from "./components/list-cash-payments/list-cash-payments.component";

const routes: Routes = [
  {
    path: "",
    component: ListCashPaymentsComponent,
    data: { breadcrumb: " Cash Payment" }
  },
  {
    path: "add",
    component: AddCashPaymentsComponent,
    data: { breadcrumb: "Add Payment" }
  },
  {
    path: "edit/:id",
    component: EditCashPaymentsComponent,
    data: { breadcrumb: "Edit Payment" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashPaymentsRoutingModule {}
