import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeriesFormsComponent } from "./forms-components/series-forms/series-forms.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProjectFormsComponent } from "./forms-components/project-forms/project-forms.component";
import { CashAccountComponent } from "./forms-components/cash-account/cash-account.component";
import { BankAccountComponent } from "./forms-components/bank-account/bank-account.component";
import { VoucherFormsComponent } from "./forms-components/voucher-forms/voucher-forms.component";

@NgModule({
  declarations: [
    SeriesFormsComponent,
    ProjectFormsComponent,
    CashAccountComponent,
    BankAccountComponent,
    VoucherFormsComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    SeriesFormsComponent,
    ProjectFormsComponent,
    CashAccountComponent,
    BankAccountComponent,
    VoucherFormsComponent,
  ],
})
export class AccswiftFormsModule {}
