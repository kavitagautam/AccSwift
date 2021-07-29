import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesReportRoutingModule } from "./sales-report-routing.module";
import { SalesReportComponent } from "./sales-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { NgxPrintModule } from "ngx-print";

@NgModule({
  declarations: [SalesReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AccswiftSharedModule,
    SalesReportRoutingModule,
    NgxPrintModule
  ],
  entryComponents: [SettingsReportsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalesReportModule {}
