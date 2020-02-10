import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompoundUnitComponent } from "./components/compound-unit/compound-unit.component";

const routes: Routes = [{ path: "", component: CompoundUnitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompoundUnitRoutingModule {}
