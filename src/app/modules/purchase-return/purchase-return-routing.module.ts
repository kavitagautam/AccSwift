import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditPurchaseReturnComponent } from "./components/edit-purchase-return/edit-purchase-return.component";
import { AddPurchaseReturnComponent } from "./components/add-purchase-return/add-purchase-return.component";
import { ListPurchaseReturnComponent } from "./components/list-purchase-return/list-purchase-return.component";

const routes: Routes = [
  {
    path: "",
    component: ListPurchaseReturnComponent,
    data: { breadcrumb: "List Purchase Return" }
  },
  {
    path: "add",
    component: AddPurchaseReturnComponent,
    data: { breadcrumb: "Add Purchase Return" }
  },
  {
    path: "edit/:id",
    component: EditPurchaseReturnComponent,
    data: { breadcrumb: "Edit Purchase Return" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReturnRoutingModule {}
