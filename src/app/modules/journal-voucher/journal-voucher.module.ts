import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { JournalVoucherRoutingModule } from "./journal-voucher.routing";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "@shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { AddJournalComponent } from "./component/add-journal/add-journal.component";
import { EditJournalComponent } from "./component/edit-journal/edit-journal.component";
import { ListJournalComponent } from "./component/list-journal/list-journal.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from "@ngx-translate/core";
import { JournalService } from "./services/journal.service";
import { LedgerFilterPipe } from "./services/ledger-filter.pipe";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [
    AddJournalComponent,
    EditJournalComponent,
    ListJournalComponent,
    LedgerFilterPipe
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
  providers: [TranslateService, JournalService]
})
export class JournalVoucherModule {}
