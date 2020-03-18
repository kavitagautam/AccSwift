import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreferenceRoutingModule } from "./preference-routing.module";
import { PreferenceComponent } from "./components/preference/preference.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [PreferenceComponent],
  imports: [
    CommonModule,
    PreferenceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PreferenceModule {}
