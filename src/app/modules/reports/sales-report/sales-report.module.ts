import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesReportRoutingModule } from "./sales-report-routing.module";
import { SalesReportComponent } from "./sales-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [SalesReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AccswiftSharedModule,
    SalesReportRoutingModule,
  ],
})
export class SalesReportModule {}
