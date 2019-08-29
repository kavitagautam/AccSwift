import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AddJournalComponent } from './add-journal/add-journal.component';
import { EditJournalComponent } from './edit-journal/edit-journal.component';
import { ListJournalComponent } from './list-journal/list-journal.component';
import { JournalVoucherRoutingModule } from './journal-voucher.routing';
import { JournalFormComponent } from './journal-form/journal-form.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '@shared/shared.module';
import { HttpClient } from "@angular/common/http";

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [
    AddJournalComponent,
    EditJournalComponent,
    ListJournalComponent,
    JournalFormComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    JournalVoucherRoutingModule,
    NgxPaginationModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })   
  ],
  providers: [
    TranslateService
  ]

})
export class JournalVoucherModule { }
