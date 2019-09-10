import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from './component/pagination/pagination.component';
import { LanguageSwitcherComponent } from './component/language-switcher/language-switcher.component';
import { CommonModalComponent } from './component/common-modal/common-modal.component';

@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule, 
  ],
  exports: [
    PaginationComponent,
    LanguageSwitcherComponent,
    CommonModalComponent
  ]
})
export class SharedModule { }
