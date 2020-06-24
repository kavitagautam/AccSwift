import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesReportRoutingModule } from "./sales-report-routing.module";
import { SalesReportComponent } from "./sales-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [SalesReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    SalesReportRoutingModule,
  ],
})
export class SalesReportModule {}
