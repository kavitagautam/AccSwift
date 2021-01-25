import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListProjectComponent } from "./components/list-project/list-project.component";

const routes: Routes = [{ path: "", component: ListProjectComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
