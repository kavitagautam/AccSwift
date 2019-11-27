import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationComponent } from "./component/pagination/pagination.component";
import { LanguageSwitcherComponent } from "./component/language-switcher/language-switcher.component";
import { CommonModalComponent } from "./component/common-modal/common-modal.component";
import { PopupAnchorDirective } from "./directives/popup-anchor/popup.anchor-target.directive";
import { CurrencyFormatPipe } from "./pipes/currency-format.pipe";
import {
  TooltipModule,
  TabsModule,
  ModalModule,
  TimepickerModule,
  BsDatepickerModule,
  BsDropdownModule,
  CollapseModule
} from "ngx-bootstrap";
import { CurrencyDirective } from "./directives/localCurrency/currency.directive";

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    CurrencyFormatPipe,
    PopupAnchorDirective,
    CurrencyDirective
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
    NgxPaginationModule
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
    CurrencyDirective
  ]
})
export class SharedModule {}
