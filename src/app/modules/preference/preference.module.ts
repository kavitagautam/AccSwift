import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PreferenceRoutingModule } from "./preference-routing.module";
import { PreferenceComponent } from "./components/preference.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OptionsComponent } from "./components/options/options.component";
import { CompanyInfoComponent } from "./components/company-info/company-info.component";
import { SalesComponent } from "./components/sales/sales.component";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { SeriesPreferenceComponent } from "./components/series-preference/series-preference.component";
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";
import { AccswiftFormsModule } from "@accSwift-modules/accswift-forms/accswift-forms.module";

@NgModule({
  declarations: [
    PreferenceComponent,
    OptionsComponent,
    CompanyInfoComponent,
    SalesComponent,
    AccountsComponent,
    SettingsComponent,
    SeriesPreferenceComponent,
  ],
  imports: [
    CommonModule,
    PreferenceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AccswiftFormsModule,
    AccswiftSharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PreferenceModule {}
