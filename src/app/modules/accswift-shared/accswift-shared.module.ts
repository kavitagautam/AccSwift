import { NgModule } from "@angular/core";
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
    LayoutModule,
    DropDownListModule,
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
  ],
  providers: [ValidationMsgService],
})
export class AccswiftSharedModule {}
