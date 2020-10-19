import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfitLossRoutingModule } from "./profit-loss-routing.module";
import { ProfitLossComponent } from "./components/profit-loss.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@NgModule({
  declarations: [ProfitLossComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    CommonModule,
    ProfitLossRoutingModule,
  ],
  entryComponents: [SettingsReportsComponent, LedgerDetailReportsComponent],
})
export class ProfitLossModule {}
