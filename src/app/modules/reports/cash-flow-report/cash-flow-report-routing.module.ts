import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashFlowReportComponent } from './component/cash-flow-report/cash-flow-report.component';

const routes: Routes = [
  {
    path: "",
    component: CashFlowReportComponent,
    data: {
      breadcrumb: "Cash Flow Report",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowReportRoutingModule { }