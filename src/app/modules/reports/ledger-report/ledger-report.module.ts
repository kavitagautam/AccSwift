import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LedgerReportRoutingModule } from "./ledger-report-routing.module";
import { LedgerReportComponent } from "./ledger-report/ledger-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@app/modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [LedgerReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    CommonModule,
    LedgerReportRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LedgerReportModule {}
