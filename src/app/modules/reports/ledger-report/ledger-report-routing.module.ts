import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LedgerReportComponent } from "./ledger-report/ledger-report.component";

const routes: Routes = [{ path: "", component: LedgerReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LedgerReportRoutingModule {}
