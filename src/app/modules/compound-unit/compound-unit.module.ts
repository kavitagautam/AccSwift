import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompoundUnitRoutingModule } from "./compound-unit-routing.module";
import { CompoundUnitComponent } from "./components/compound-unit/compound-unit.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [CompoundUnitComponent],
  imports: [
    CommonModule,
    CompoundUnitRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AccswiftSharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ],
})
export class CompoundUnitModule {}
