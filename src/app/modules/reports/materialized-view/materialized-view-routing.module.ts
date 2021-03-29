import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterializedViewComponent } from './materialized-view/materialized-view.component';

const routes: Routes = [{
  path: "", component:MaterializedViewComponent, data: {
    breadcrumb: "Materialized View",
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterializedViewRoutingModule { }
