import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StockStatusRoutingModule } from "./stock-status-routing.module";
import { StockStatusComponent } from "./stock-status/stock-status.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [StockStatusComponent],
  imports: [
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    StockStatusRoutingModule,
  ],
})
export class StockStatusModule {}
