import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from './component/pagination/pagination.component';
import { LanguageSwitcherComponent } from './component/language-switcher/language-switcher.component';



@NgModule({
  declarations: [
    PaginationComponent,
    LanguageSwitcherComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [
    PaginationComponent,
    LanguageSwitcherComponent
  ]
})
export class SharedModule { }
