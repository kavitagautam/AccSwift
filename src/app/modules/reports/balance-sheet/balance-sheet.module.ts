import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BalanceSheetRoutingModule } from "./balance-sheet-routing.module";
import { BalanceSheetComponent } from "./component/balance-sheet/balance-sheet.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { GroupBalanceReportComponent } from "@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@NgModule({
  declarations: [BalanceSheetComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    CommonModule,
    BalanceSheetRoutingModule,
  ],
  entryComponents: [
    SettingsReportsComponent,
    GroupBalanceReportComponent,
    LedgerDetailReportsComponent,
  ],
})
export class BalanceSheetModule {}
