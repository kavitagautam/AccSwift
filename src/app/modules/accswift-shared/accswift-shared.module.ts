import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LedgerFilterPipe } from "./pipes/ledger-filter/ledger-filter.pipe";
import { LedgerModalPopupComponent } from "./components/ledger-modal-popup/ledger-modal-popup.component";
import { ProductModalPopupComponent } from "./components/product-modal-popup/product-modal-popup.component";
import { CashPartyModalPopupComponent } from "./components/cash-party-modal-popup/cash-party-modal-popup.component";
import { NumberToWordsPipe } from "./pipes/number-to-words/number-to-words.pipe";
import { AddProductComponent } from "./components/add-product/add-product/add-product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageCropperModule } from "ngx-image-cropper";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LayoutModule } from "@progress/kendo-angular-layout";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { DecimalPlaceDirective } from "./directives/decimal-place/decimal-place.directive";
import { CurrencyDirective } from "./directives/localCurrency/currency.directive";
import { CurrencyFormatPipe } from "./pipes/currency-format/currency-format.pipe";
import { FormSubmitValidationMsgDirective } from "./directives/form-validators/submit-validation-msg.directive";
import { FormControlValidationMsgDirective } from "./directives/form-validators/validation-message.directive";
import { ValidationMsgService } from "./services/form-validators/validation-message.service";
import { SharedModule } from "@app/shared/shared.module";
import { DetailsEntryGridComponent } from "./components/details-entry-grid/details-entry-grid.component";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { CustomerInvoicesComponent } from "./components/customer-invoices/customer-invoices.component";
import { NgxPrintModule } from "ngx-print";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { CreateReportsComponent } from "./components/create-reports/create-reports.component";
import { AddressComponent } from "./components/address/address.component";
import { SettingsReportsComponent } from "./components/settings-reports/settings-reports.component";
import { GroupBalanceReportComponent } from "./components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "./components/ledger-detail-reports/ledger-detail-reports.component";
import { EntrySubLedgerComponent } from "./components/entry-sub-ledger/entry-sub-ledger.component";
import { OpeningBalanceComponent } from "./components/opening-balance/opening-balance.component";
import { BasicAddEditUserComponent } from './components/basic-add-edit-user/basic-add-edit-user.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';

@NgModule({
  declarations: [
    LedgerFilterPipe,
    LedgerModalPopupComponent,
    ProductModalPopupComponent,
    CashPartyModalPopupComponent,
    NumberToWordsPipe,
    AddProductComponent,
    DecimalPlaceDirective,
    CurrencyDirective,
    CurrencyFormatPipe,
    FormSubmitValidationMsgDirective,
    FormControlValidationMsgDirective,
    DetailsEntryGridComponent,
    CustomerInvoicesComponent,
    CreateReportsComponent,
    AddressComponent,
    ForgetPasswordComponent,
    SettingsReportsComponent,
    GroupBalanceReportComponent,
    LedgerDetailReportsComponent,
    OpeningBalanceComponent,
    EntrySubLedgerComponent,
    BasicAddEditUserComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    CommonModule,
    GridModule,
    PopupModule,
    SharedModule,
    InputsModule,
    NgxPrintModule,
    PDFExportModule,
    LayoutModule,
    DropDownListModule,
    DateInputsModule,
    DropDownsModule,
  ],
  exports: [
    LedgerModalPopupComponent,
    ProductModalPopupComponent,
    CashPartyModalPopupComponent,
    NumberToWordsPipe,
    DecimalPlaceDirective,
    CurrencyDirective,
    CurrencyFormatPipe,
    FormSubmitValidationMsgDirective,
    FormControlValidationMsgDirective,
    DetailsEntryGridComponent,
    CustomerInvoicesComponent,
    CreateReportsComponent,
    AddressComponent,
    SettingsReportsComponent,
    GroupBalanceReportComponent,
    LedgerDetailReportsComponent,
    OpeningBalanceComponent,
    ForgetPasswordComponent
  ],
  providers: [ValidationMsgService],
  entryComponents: [
    AddProductComponent,
    ProductModalPopupComponent,
    LedgerModalPopupComponent,
    EntrySubLedgerComponent,
    BasicAddEditUserComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccswiftSharedModule {}
