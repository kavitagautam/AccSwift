import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListUnitMaintenanceComponent } from "./components/list-unit-maintenance.component";

const routes: Routes = [{ path: "", component: ListUnitMaintenanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitMaintenanceRoutingModule {}
