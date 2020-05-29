import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListDepotComponent } from "./components/list-depot.component";

const routes: Routes = [{ path: "", component: ListDepotComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepotRoutingModule {}
