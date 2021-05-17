import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccessRoleComponent } from "./components/access-role/access-role.component";
import { AddAccessRolesComponent } from "./components/add-access-roles/add-access-roles.component";
import { EditAccessRolesComponent } from "./components/edit-access-roles/edit-access-roles.component";
import { ListAccessRolesComponent } from "./components/list-access-roles/list-access-roles.component";

const routes: Routes = [
{
  path: "",
  component: ListAccessRolesComponent,
  data: {breadcrumb: "List Access Roles"}
},
{
  path: "add",
  component: AddAccessRolesComponent,
  data: {breadcrumb: "Add Access Roles"}
},
{
  path: "edit/:id",
  component: EditAccessRolesComponent,
  data: {breadcrumb: "Edit Access Roles"}
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccessRoleRoutingModule {}
