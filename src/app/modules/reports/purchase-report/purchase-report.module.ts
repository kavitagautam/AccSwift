import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PurchaseReportRoutingModule } from "./purchase-report-routing.module";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [PurchaseReportComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    CommonModule,
    PurchaseReportRoutingModule,
  ],
})
export class PurchaseReportModule {}
