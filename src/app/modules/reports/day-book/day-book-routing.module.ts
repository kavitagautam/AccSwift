import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DayBookComponent } from "./components/day-book/day-book.component";

const routes: Routes = [
  {
    path: "",
    component: DayBookComponent,
    data: { breadcrumb: "Trial Balance" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DayBookRoutingModule {}
