import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListBankReconciliationComponent } from "./components/list-bank-reconciliation/list-bank-reconciliation.component";
import { AddBankReconciliationComponent } from "./components/add-bank-reconciliation/add-bank-reconciliation.component";
import { EditBankReconciliationComponent } from "./components/edit-bank-reconciliation/edit-bank-reconciliation.component";

const routes: Routes = [
  {
    path: "",
    component: ListBankReconciliationComponent,
    data: {
      breadcrumb: "Bank Reconciliation"
    }
  },
  {
    path: "add",
    component: AddBankReconciliationComponent,
    data: { breadcrumb: "Add Reconciliation" }
  },
  {
    path: "edit/:id",
    component: EditBankReconciliationComponent,
    data: { breadcrumb: "Edit Reconciliation" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReconciliationRoutingModule {}
