import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingLedgerComponent } from "./components/landing-ledger/landing-ledger.component";

const routes: Routes = [{ path: "", component: LandingLedgerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerRoutingModule {}
