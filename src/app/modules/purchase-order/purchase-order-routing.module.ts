import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPurchaseOrderComponent } from "./components/list-purchase-order/list-purchase-order.component";
import { AddPurchaseOrderComponent } from './components/add-purchase-order/add-purchase-order.component';
import { EditPurchaseOrderComponent } from './components/edit-purchase-order/edit-purchase-order.component';

const routes: Routes = [
  {
    path: "",
    component: ListPurchaseOrderComponent,
    data: { breadcrumb: "List Purchase Order" }
  },
  {
    path: "add",
    component: AddPurchaseOrderComponent,
    data: { breadcrumb: "Add Purchase Order" }
  },
  {
    path: "edit/:id",
    component: EditPurchaseOrderComponent,
    data: { breadcrumb: "Edit Purchase Order" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule {}
