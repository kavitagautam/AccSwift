import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared/shared.module";
import { DepotRoutingModule } from "./depot-routing.module";
import { ListDepotComponent } from "./components/list-depot.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [ListDepotComponent],
  imports: [
    CommonModule,
    DepotRoutingModule,
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
export class DepotModule {}
