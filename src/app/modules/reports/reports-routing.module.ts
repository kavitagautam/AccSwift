import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportPdfComponent } from "./components/report-pdf/report-pdf.component";
import { TrialBalanceComponent } from "./components/trial-balance/trial-balance.component";

const routes: Routes = [{ path: "", component: TrialBalanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
