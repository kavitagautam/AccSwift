import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StockStatusComponent } from "./stock-status/stock-status.component";

const routes: Routes = [
  {
    path: "",
    component: StockStatusComponent,
    data: { breadcrumb: "Stock Status" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockStatusRoutingModule {}
