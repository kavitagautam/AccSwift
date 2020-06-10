import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";

const routes: Routes = [
  {
    path: "",
    component: PurchaseReportComponent,
    data: {
      breadcrumb: "Purchase Report",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseReportRoutingModule {}
