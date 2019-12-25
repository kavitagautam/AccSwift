import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankPaymentComponent } from "./components/list-bank-payment/list-bank-payment.component";
import { AddBankPaymentComponent } from "./components/add-bank-payment/add-bank-payment.component";
import { EditBankPaymentComponent } from "./components/edit-bank-payment/edit-bank-payment.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankPaymentComponent,
    data: { breadcrumb: "Bank Payment" }
  },
  {
    path: "add",
    component: AddBankPaymentComponent,
    data: { breadcrumb: "Add Payment" }
  },
  {
    path: "edit/:id",
    component: EditBankPaymentComponent,
    data: { breadcrumb: "Edit Payment" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentRoutingModule {}
