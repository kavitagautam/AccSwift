import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StockStatusRoutingModule } from "./stock-status-routing.module";
import { StockStatusComponent } from "./stock-status/stock-status.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";

@NgModule({
  declarations: [StockStatusComponent],
  imports: [
    FormsModule,
    SharedModule,
    AccswiftSharedModule,
    ReactiveFormsModule,
    CommonModule,
    StockStatusRoutingModule,
  ],
  entryComponents: [SettingsReportsComponent],
})
export class StockStatusModule {}
