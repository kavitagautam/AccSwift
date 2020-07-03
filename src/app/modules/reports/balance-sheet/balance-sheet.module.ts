import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BalanceSheetRoutingModule } from "./balance-sheet-routing.module";
import { BalanceSheetComponent } from "./component/balance-sheet/balance-sheet.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [BalanceSheetComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    BalanceSheetRoutingModule,
  ],
})
export class BalanceSheetModule {}
