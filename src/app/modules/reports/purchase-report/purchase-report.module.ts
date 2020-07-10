import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseReportRoutingModule } from "./purchase-report-routing.module";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [PurchaseReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    PurchaseReportRoutingModule,
  ],
})
export class PurchaseReportModule {}