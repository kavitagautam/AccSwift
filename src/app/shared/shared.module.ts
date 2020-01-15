import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationComponent } from "./component/pagination/pagination.component";
import { LanguageSwitcherComponent } from "./component/language-switcher/language-switcher.component";
import { CommonModalComponent } from "./component/common-modal/common-modal.component";
import { PopupAnchorDirective } from "./directives/popup-anchor/popup.anchor-target.directive";
import { CurrencyFormatPipe } from "./pipes/currency-format.pipe";
import { CurrencyDirective } from "./directives/localCurrency/currency.directive";
import { LedgerModelPopupComponent } from './component/ledger-model-popup/ledger-model-popup.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LedgerFilterPipe } from './pipes/ledger-filter/ledger-filter.pipe';
import { CollapseModule, TooltipModule, TabsModule, ModalModule, TimepickerModule, BsDatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { DateFormatPipe } from './pipes/dateFormat/date-format.pipe';

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    CurrencyFormatPipe,
    PopupAnchorDirective,
    CurrencyDirective,
    LedgerFilterPipe,
    LedgerModelPopupComponent,
    DateFormatPipe
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
    DropDownsModule
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
    DateFormatPipe
  ]
})
export class SharedModule {}
