import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProjectRoutingModule } from "./project-routing.module";
import { ListProjectComponent } from "./components/list-project/list-project.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule, SharedModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import {
  DropDownListModule,
  DropDownsModule,
} from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [ListProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    DropDownListModule,
    DropDownsModule,
    InputsModule,
    SharedModule,
    AccswiftSharedModule,
  ],
})
export class ProjectModule {}
