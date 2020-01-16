import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListSalesReturnComponent } from "./components/list-sales-return/list-sales-return.component";
import { AddSalesReturnComponent } from "./components/add-sales-return/add-sales-return.component";
import { EditSalesReturnComponent } from "./components/edit-sales-return/edit-sales-return.component";

const routes: Routes = [
  {
    path: "",
    component: ListSalesReturnComponent,
    data: { breadcrumb: "List Sales Return" }
  },
  {
    path: "add",
    component: AddSalesReturnComponent,
    data: { breadcrumb: "Add Sales Return" }
  },
  {
    path: "edit/:id",
    component: EditSalesReturnComponent,
    data: { breadcrumb: "Edit Sales Return" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReturnRoutingModule {}
