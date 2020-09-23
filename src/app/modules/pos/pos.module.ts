import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PosRoutingModule } from "./pos-routing.module";
import { PosComponent } from "./components/pos/pos.component";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";

import { InputsModule } from "@progress/kendo-angular-inputs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [PosComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PosRoutingModule,
    GridModule,
    PopupModule,
    SharedModule,
    AccswiftSharedModule,
    InputsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PosModule {}
