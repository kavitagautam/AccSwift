import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from "ngx-print";
import { CashFlowReportRoutingModule } from './cash-flow-report-routing.module';
import { CashFlowReportComponent } from './component/cash-flow-report/cash-flow-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { GroupBalanceReportComponent } from '@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component';
import { LedgerDetailReportsComponent } from '@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component';

@NgModule({
  declarations: [CashFlowReportComponent],
  imports: [
    CommonModule,
    CashFlowReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    NgxPrintModule
  ],
  entryComponents: [SettingsReportsComponent, GroupBalanceReportComponent,
    LedgerDetailReportsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashFlowReportModule { }
