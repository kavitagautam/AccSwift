import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UnitMaintenanceRoutingModule } from "./unit-maintenance-routing.module";
import { ListUnitMaintenanceComponent } from "./components/list-unit-maintenance/list-unit-maintenance.component";
import { EditUnitMaintenanceComponent } from "./components/edit-unit-maintenance/edit-unit-maintenance.component";
import { AddUnitMaintenanceComponent } from "./components/add-unit-maintenance/add-unit-maintenance.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule, GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import {
  DropDownListModule,
  DropDownsModule
} from "@progress/kendo-angular-dropdowns";

@NgModule({
  declarations: [
    ListUnitMaintenanceComponent,
    EditUnitMaintenanceComponent,
    AddUnitMaintenanceComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    CommonModule,
    UnitMaintenanceRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class UnitMaintenanceModule {}
