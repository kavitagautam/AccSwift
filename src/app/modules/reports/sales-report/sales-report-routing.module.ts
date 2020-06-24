import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SalesReportComponent } from "./sales-report.component";

const routes: Routes = [
  {
    path: "",
    component: SalesReportComponent,
    data: {
      breadcrumb: "Sales Report",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReportRoutingModule {}
