import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BalanceSheetRoutingModule } from "./balance-sheet-routing.module";
import { BalanceSheetComponent } from "./component/balance-sheet/balance-sheet.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { AccswiftSharedModule } from "@app/modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [BalanceSheetComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    CommonModule,
    BalanceSheetRoutingModule,
  ],
})
export class BalanceSheetModule {}
