import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccessRoleRoutingModule } from "./access-role-routing.module";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { SharedModule } from "@app/shared/shared.module";
import { AddAccessRolesComponent } from './components/add-access-roles/add-access-roles.component';
import { EditAccessRolesComponent } from './components/edit-access-roles/edit-access-roles.component';
import { ListAccessRolesComponent } from './components/list-access-roles/list-access-roles.component';
import { DropDownListModule, DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { GridModule } from "@progress/kendo-angular-grid";
import { NumericTextBoxModule } from "@progress/kendo-angular-inputs";
import { LayoutModule } from "@progress/kendo-angular-layout";

@NgModule({
  declarations: [
    AddAccessRolesComponent,
    EditAccessRolesComponent,
    ListAccessRolesComponent
  ],

  imports: [
    CommonModule, 
    AccessRoleRoutingModule, 
    TreeViewModule, 
    FormsModule,
    ReactiveFormsModule, 
    AccswiftSharedModule, 
    SharedModule, 
    GridModule,
    LayoutModule,
    DropDownListModule,
    DateInputsModule,
    DropDownsModule,
    NumericTextBoxModule],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccessRoleModule {}
