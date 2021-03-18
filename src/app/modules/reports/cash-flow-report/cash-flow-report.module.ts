import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashFlowReportRoutingModule } from './cash-flow-report-routing.module';
import { CashFlowReportComponent } from './component/cash-flow-report/cash-flow-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';

@NgModule({
  declarations: [CashFlowReportComponent],
  imports: [
    CommonModule,
    CashFlowReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule
  ],
  entryComponents: [SettingsReportsComponent]
})
export class CashFlowReportModule { }