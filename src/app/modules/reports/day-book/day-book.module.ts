import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DayBookRoutingModule } from "./day-book-routing.module";
import { DayBookComponent } from "./components/day-book/day-book.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [DayBookComponent],
  imports: [
    CommonModule,
    DayBookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class DayBookModule {}
