import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./components/settings/settings.component";
import { OprionsComponent } from './components/oprions/oprions.component';

@NgModule({
  declarations: [SettingsComponent, OprionsComponent],
  imports: [CommonModule, SettingsRoutingModule]
})
export class SettingsModule {}
