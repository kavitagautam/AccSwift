import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccessRoleRoutingModule } from "./access-role-routing.module";
import { AccessRoleComponent } from "./components/access-role/access-role.component";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AccessRoleComponent],
  imports: [CommonModule, AccessRoleRoutingModule, TreeViewModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccessRoleModule {}
