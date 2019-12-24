import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListSalesOrderComponent } from "./components/list-sales-order/list-sales-order.component";
import { AddSalesOrderComponent } from "./components/add-sales-order/add-sales-order.component";
import { EditSalesOrderComponent } from "./components/edit-sales-order/edit-sales-order.component";

const routes: Routes = [
  {
    path: "",
    component: ListSalesOrderComponent,
    data: { breadcrumb: "List Sales Order" }
  },
  {
    path: "add",
    component: AddSalesOrderComponent,
    data: { breadcrumb: "Add Sales Order" }
  },
  {
    path: "edit/:id",
    component: EditSalesOrderComponent,
    data: { breadcrumb: "Edit Sales Order" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule {}
