import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";


import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from './component/pagination/pagination.component';



@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [PaginationComponent]
})
export class SharedModule { }
