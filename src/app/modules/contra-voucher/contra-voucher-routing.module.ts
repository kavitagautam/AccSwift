import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListContraVoucherComponent } from "./components/list-contra-voucher/list-contra-voucher.component";
import { AddContraVoucherComponent } from "./components/add-contra-voucher/add-contra-voucher.component";
import { EditContraVoucherComponent } from "./components/edit-contra-voucher/edit-contra-voucher.component";

const routes: Routes = [
  {
    path: "",
    component: ListContraVoucherComponent,
    data: { breadcrumb: "Contra Voucher" }
  },
  {
    path: "add",
    component: AddContraVoucherComponent,
    data: { breadcrumb: "Add Contra Voucher" }
  },
  {
    path: "edit",
    component: EditContraVoucherComponent,
    data: { breadcrumb: "Edit Contra Voucher" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraVoucherRoutingModule { }
