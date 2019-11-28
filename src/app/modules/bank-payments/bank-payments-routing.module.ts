import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankPaymentsComponent } from "./components/list-bank-payments/list-bank-payments.component";
import { AddBankPaymentsComponent } from "./components/add-bank-payments/add-bank-payments.component";
import { EditBankPaymentsComponent } from "./components/edit-bank-payments/edit-bank-payments.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankPaymentsComponent,
    data: { breadcrumb: "Bank Payments" }
  },
  {
    path: "add",
    component: AddBankPaymentsComponent,
    data: { breadcrumb: "Add Payments" }
  },
  {
    path: "edit",
    component: EditBankPaymentsComponent,
    data: { breadcrumb: "Edit Payments" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentsRoutingModule {}
