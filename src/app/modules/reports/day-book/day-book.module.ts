import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DayBookRoutingModule } from "./day-book-routing.module";
import { DayBookComponent } from "./components/day-book/day-book.component";

@NgModule({
  declarations: [DayBookComponent],
  imports: [CommonModule, DayBookRoutingModule],
})
export class DayBookModule {}
