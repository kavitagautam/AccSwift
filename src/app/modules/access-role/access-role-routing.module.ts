import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccessRoleComponent } from "./components/access-role/access-role.component";

const routes: Routes = [{ path: "", component: AccessRoleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoleRoutingModule {}
