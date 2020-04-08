import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationComponent } from "./component/pagination/pagination.component";
import { LanguageSwitcherComponent } from "./component/language-switcher/language-switcher.component";
import { CommonModalComponent } from "./component/common-modal/common-modal.component";
import { PopupAnchorDirective } from "./directives/popup-anchor/popup.anchor-target.directive";
import { CurrencyFormatPipe } from "./pipes/currency-format.pipe";
import { CurrencyDirective } from "./directives/localCurrency/currency.directive";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { LedgerFilterPipe } from "./pipes/ledger-filter/ledger-filter.pipe";
import {
  CollapseModule,
  TooltipModule,
  TabsModule,
  ModalModule,
  TimepickerModule,
  BsDatepickerModule,
  BsDropdownModule,
} from "ngx-bootstrap";
import { DateFormatPipe } from "./pipes/dateFormat/date-format.pipe";
import { FormSubmitValidationMsgDirective } from "./directives/form-validators/submit-validation-msg.directive";
import { FormControlValidationMsgDirective } from "./directives/form-validators/validation-message.directive";
import { ValidationMsgService } from "./services/form-validators/validation-message.service";
import { PhoneMaskDirective } from "./directives/phone-mask/phone-mask.directive";
import { CashPartyModalPopupComponent } from "./component/cash-party-modal-popup/cash-party-modal-popup.component";
import { ProductModalPopupComponent } from "./component/product-modal-popup/product-modal-popup.component";
import { LedgerModalPopupComponent } from "./component/ledger-modal-popup/ledger-modal-popup.component";
import { DecimalPlaceDirective } from "./directives/decimal-place/decimal-place.directive";

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    CurrencyFormatPipe,
    PopupAnchorDirective,
    CurrencyDirective,
    LedgerFilterPipe,
    LedgerModalPopupComponent,
    DateFormatPipe,
    FormSubmitValidationMsgDirective,
    FormControlValidationMsgDirective,
    PhoneMaskDirective,
    ProductModalPopupComponent,
    CashPartyModalPopupComponent,
    DecimalPlaceDirective,
  ],
  imports: [
    CommonModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    NgxPaginationModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ],
  exports: [
    CollapseModule,
    TooltipModule,
    TabsModule,
    ModalModule,
    PaginationComponent,
    NgxPaginationModule,
    LanguageSwitcherComponent,
    TimepickerModule,
    BsDatepickerModule,
    BsDropdownModule,
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    PopupAnchorDirective,
    CurrencyFormatPipe,
    CurrencyDirective,
    DateFormatPipe,
    FormSubmitValidationMsgDirective,
    FormControlValidationMsgDirective,
    PhoneMaskDirective,
    ProductModalPopupComponent,
    CashPartyModalPopupComponent,
    DecimalPlaceDirective,
  ],
  providers: [ValidationMsgService],
})
export class SharedModule {}
