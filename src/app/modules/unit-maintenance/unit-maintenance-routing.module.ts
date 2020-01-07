import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListUnitMaintenanceComponent } from "./components/list-unit-maintenance/list-unit-maintenance.component";
import { AddUnitMaintenanceComponent } from "./components/add-unit-maintenance/add-unit-maintenance.component";
import { EditUnitMaintenanceComponent } from "./components/edit-unit-maintenance/edit-unit-maintenance.component";

const routes: Routes = [
  { path: "", component: ListUnitMaintenanceComponent },
  {
    path: "add",
    component: AddUnitMaintenanceComponent,
    data: { breadcrumb: "Add Unit Maintenance" }
  },
  {
    path: "edit/:id",
    component: EditUnitMaintenanceComponent,
    data: { breadcrumb: "Edit Unit Maintenance" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitMaintenanceRoutingModule {}
