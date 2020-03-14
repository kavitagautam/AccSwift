import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreferenceRoutingModule } from "./preference-routing.module";
import { PreferenceComponent } from "./components/preference/preference.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OptionsComponent } from './components/preference/options/options.component';
import { CompanyInfoComponent } from './components/preference/company-info/company-info.component';
import { SalesComponent } from './components/preference/sales/sales.component';
import { AccountsComponent } from './components/preference/accounts/accounts.component';
import { SettingsComponent } from './components/preference/settings/settings.component';

@NgModule({
  declarations: [PreferenceComponent, OptionsComponent, CompanyInfoComponent, SalesComponent, AccountsComponent, SettingsComponent],
  imports: [
    CommonModule,
    PreferenceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PreferenceModule {}
