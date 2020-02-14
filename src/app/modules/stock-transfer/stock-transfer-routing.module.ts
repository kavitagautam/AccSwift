import { EditStockTransferComponent } from "./components/edit-stock-transfer/edit-stock-transfer.component";
import { AddStockTransferComponent } from "./components/add-stock-transfer/add-stock-transfer.component";
import { ListStockTransferComponent } from "./components/list-stock-transfer/list-stock-transfer.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: ListStockTransferComponent,
    data: { breadcrumb: "List Stock Transfer" }
  },
  {
    path: "add",
    component: AddStockTransferComponent,
    data: { breadcrumb: "Add Stock Transfer" }
  },
  {
    path: "edit/:id",
    component: EditStockTransferComponent,
    data: { breadcrumb: "Edit Stock Transfer" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransferRoutingModule {}
