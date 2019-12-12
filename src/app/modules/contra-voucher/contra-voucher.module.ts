import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ContraVoucherRoutingModule } from "./contra-voucher-routing.module";
import { ListContraVoucherComponent } from "./components/list-contra-voucher/list-contra-voucher.component";
import { EditContraVoucherComponent } from "./components/edit-contra-voucher/edit-contra-voucher.component";
import { AddContraVoucherComponent } from "./components/add-contra-voucher/add-contra-voucher.component";

@NgModule({
  declarations: [
    ListContraVoucherComponent,
    EditContraVoucherComponent,
    AddContraVoucherComponent
  ],
  imports: [CommonModule, ContraVoucherRoutingModule]
})
export class ContraVoucherModule {}
