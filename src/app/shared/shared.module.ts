import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationComponent } from "./component/pagination/pagination.component";
import { LanguageSwitcherComponent } from "./component/language-switcher/language-switcher.component";
import { CommonModalComponent } from "./component/common-modal/common-modal.component";
import { PopupAnchorDirective } from "./directives/popup-anchor/popup.anchor-target.directive";
import { CurrencyFormatPipe } from "./pipes/currency-format.pipe";

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    CurrencyFormatPipe,
    PopupAnchorDirective
  ],
  imports: [CommonModule, NgxPaginationModule],
  exports: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    PopupAnchorDirective,
    CurrencyFormatPipe
  ]
})
export class SharedModule {}
