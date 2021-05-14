import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccessRoleRoutingModule } from "./access-role-routing.module";
import { AccessRoleComponent } from "./components/access-role/access-role.component";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [AccessRoleComponent],
  imports: [
    CommonModule, 
    AccessRoleRoutingModule, 
    TreeViewModule, 
    FormsModule,
    ReactiveFormsModule, 
    AccswiftSharedModule, 
    SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccessRoleModule {}
