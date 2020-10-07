import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { IntlModule } from "@progress/kendo-angular-intl";
import { NumericTextBoxModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportPdfComponent } from "./components/report-pdf/report-pdf.component";
import { TrialBalanceComponent } from "./components/trial-balance/trial-balance.component";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { GroupBalanceReportComponent } from "@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@NgModule({
  declarations: [ReportPdfComponent, TrialBalanceComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonsModule,
    IntlModule,
    FormsModule,
    ReactiveFormsModule,
    NumericTextBoxModule,
    PDFExportModule,
    SharedModule,
    AccswiftSharedModule,
  ],
  entryComponents: [
    SettingsReportsComponent,
    GroupBalanceReportComponent,
    LedgerDetailReportsComponent,
  ],
})
export class ReportsModule {}
