import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TrialBalanceComponent } from "./components/trial-balance/trial-balance.component";

const routes: Routes = [
  {
    path: "",
    component: TrialBalanceComponent,
    data: { breadcrumb: "Trial Balance" },
  },
  {
    path: "day-book",
    component: TrialBalanceComponent,
    data: { breadcrumb: "Day Book" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
