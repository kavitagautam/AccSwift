import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfitLossRoutingModule } from "./profit-loss-routing.module";
import { ProfitLossComponent } from "./components/profit-loss.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [ProfitLossComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    ProfitLossRoutingModule,
  ],
})
export class ProfitLossModule {}
