import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreferenceRoutingModule } from "./preference-routing.module";
import { PreferenceComponent } from "./components/preference.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OptionsComponent } from "./components/options/options.component";
import { CompanyInfoComponent } from "./components/company-info/company-info.component";
import { SalesComponent } from "./components/sales/sales.component";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { SeriesPreferenceComponent } from './components/series-preference/series-preference.component';

@NgModule({
  declarations: [
    PreferenceComponent,
    OptionsComponent,
    CompanyInfoComponent,
    SalesComponent,
    AccountsComponent,
    SettingsComponent,
    SeriesPreferenceComponent
  ],
  imports: [
    CommonModule,
    PreferenceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PreferenceModule {}
