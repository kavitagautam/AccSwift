import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompoundUnitRoutingModule } from "./compound-unit-routing.module";
import { CompoundUnitComponent } from "./components/compound-unit/compound-unit.component";

@NgModule({
  declarations: [CompoundUnitComponent],
  imports: [
    CommonModule,
    CompoundUnitRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CompoundUnitModule {}
