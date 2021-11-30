import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeriesFormsComponent } from "./forms-components/series-forms/series-forms.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProjectFormsComponent } from "./forms-components/project-forms/project-forms.component";
import { CashAccountComponent } from "./forms-components/cash-account/cash-account.component";
import { BankAccountComponent } from "./forms-components/bank-account/bank-account.component";
import { VoucherFormsComponent } from "./forms-components/voucher-forms/voucher-forms.component";
import { CashPartyAccountComponent } from "./forms-components/cash-party-account/cash-party-account.component";
import { CashPartyModalPopupComponent } from "../accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { SalesAccountComponent } from "./forms-components/sales-account/sales-account.component";
import { DepotComponent } from "./forms-components/depot/depot.component";
import { PurchaseAccountComponent } from "./forms-components/purchase-account/purchase-account.component";
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SeriesFormsComponent,
    ProjectFormsComponent,
    CashAccountComponent,
    BankAccountComponent,
    VoucherFormsComponent,
    CashPartyAccountComponent,
    SalesAccountComponent,
    DepotComponent,
    PurchaseAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PopupModule,
    ReactiveFormsModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    NgSelectModule
  ],
  exports: [
    SeriesFormsComponent,
    ProjectFormsComponent,
    CashAccountComponent,
    BankAccountComponent,
    VoucherFormsComponent,
    CashPartyAccountComponent,
    SalesAccountComponent,
    DepotComponent,
    PurchaseAccountComponent,
  ],
  entryComponents: [CashPartyModalPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccswiftFormsModule {}
