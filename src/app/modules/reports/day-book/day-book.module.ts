import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DayBookRoutingModule } from "./day-book-routing.module";
import { DayBookComponent } from "./components/day-book/day-book.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { AccswiftFormsModule } from "@app/modules/accswift-forms/accswift-forms.module";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { NepaliDatepickerModule } from "@lib/nepali-datepicker/src/public-api";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@NgModule({
  declarations: [DayBookComponent],
  imports: [
    CommonModule,
    DayBookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    GridModule,
    AccswiftFormsModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    NepaliDatepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModalPopupComponent],
})
export class DayBookModule {}
