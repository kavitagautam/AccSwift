import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationComponent } from "./components/pagination/pagination.component";
import { CommonModalComponent } from "./components/common-modal/common-modal.component";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
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
import { PhoneMaskDirective } from "./directives/phone-mask/phone-mask.directive";
import { PMaskDirective } from "./directives/phone-mask/p-mask.directive";
import { LanguageSwitcherComponent } from "./components/language-switcher/language-switcher.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { ImageCropperModule } from "ngx-image-cropper";
import { PopupAnchorDirective } from "./directives/popup-anchor/popup.anchor-target.directive";
import { FormControlValidationMessageDirective } from "./directives/validators/validation-message.directive";
import { FormSubmitValidationMessageDirective } from "./directives/validators/submit-validation-msg.directive";
import { TimezoneDirective } from "./directives/date-timezone/timezone.directive";
import { DateConversionPipe } from './pipes/date-conversion/date-conversion.pipe';

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    PopupAnchorDirective,
    DateFormatPipe,
    PhoneMaskDirective,
    PMaskDirective,
    FormControlValidationMessageDirective,
    FormSubmitValidationMessageDirective,
    TimezoneDirective,
    DateConversionPipe,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    ImageCropperModule,
    GridModule,
    PopupModule,
    InputsModule,
    LayoutModule,
    DropDownListModule,
    DropDownsModule,
  ],
  exports: [
    CollapseModule,
    PopupAnchorDirective,
    TooltipModule,
    TabsModule,
    ModalModule,
    NgxPaginationModule,
    TimepickerModule,
    BsDatepickerModule,
    BsDropdownModule,
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    DateFormatPipe,
    PhoneMaskDirective,
    PMaskDirective,
    FormControlValidationMessageDirective,
    FormSubmitValidationMessageDirective,
  ],
})
export class SharedModule {}
