import { AddDepotComponent } from "./components/add-depot/add-depot.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListDepotComponent } from "./components/list-depot/list-depot.component";
import { EditDepotComponent } from "./components/edit-depot/edit-depot.component";

const routes: Routes = [
  { path: "", component: ListDepotComponent },
  {
    path: "add",
    component: AddDepotComponent,
    data: { breadcrumb: "Add Depot" }
  },
  {
    path: "edit/:id",
    component: EditDepotComponent,
    data: { breadcrumb: "Edit Depot" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepotRoutingModule {}
