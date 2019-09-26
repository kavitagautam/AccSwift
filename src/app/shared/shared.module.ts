import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from './component/pagination/pagination.component';
import { LanguageSwitcherComponent } from './component/language-switcher/language-switcher.component';
import { CommonModalComponent } from './component/common-modal/common-modal.component';
import { PopupAnchorDirective } from './directives/popup-anchor/popup.anchor-target.directive';

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    PopupAnchorDirective
  ],
  imports: [
    CommonModule,
    NgxPaginationModule, 
  ],
  exports: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent,
    PopupAnchorDirective
  ]
})
export class SharedModule { }
