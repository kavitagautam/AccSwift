import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { JournalVoucherRoutingModule } from "./journal-voucher.routing";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";

import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { AddJournalComponent } from "./component/add-journal/add-journal.component";
import { EditJournalComponent } from "./component/edit-journal/edit-journal.component";
import { ListJournalComponent } from "./component/list-journal/list-journal.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { JournalService } from "./services/journal.service";
import { NepaliDatepickerModule } from "@lib/nepali-datepicker/src/public-api";
import { AccswiftFormsModule } from "../accswift-forms/accswift-forms.module";
import { LedgerModalPopupComponent } from "../accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [
    AddJournalComponent,
    EditJournalComponent,
    ListJournalComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AccswiftSharedModule,
    GridModule,
    AccswiftFormsModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    NepaliDatepickerModule,
    JournalVoucherRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [TranslateService, JournalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LedgerModalPopupComponent],
})
export class JournalVoucherModule {}
