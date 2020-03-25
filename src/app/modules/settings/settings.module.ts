import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";

import { SettingsComponent } from "./components/settings.component";

import { AccountsComponent } from "./components/accounts/accounts.component";
import { SettingComponent } from "./components/setting/setting.component";
import { SlabsComponent } from "./components/slabs/slabs.component";
import { DefaultsComponent } from "./components/defaults/defaults.component";
import { BackupComponent } from "./components/backup/backup.component";
import { OptionsComponent } from "./components/options/options.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    SettingsComponent,
    AccountsComponent,
    SettingComponent,
    SlabsComponent,
    DefaultsComponent,
    BackupComponent,
    OptionsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule {}
