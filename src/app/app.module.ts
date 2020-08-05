import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
  LOCALE_ID,
} from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpInterceptorsService } from "./core/services/http-interceptors/http-interceptors.service";
import { PreferenceService } from "./modules/preference/services/preference.service";
import { PreferenceModel } from "./modules/preference/models/preference.model";
import { Observable } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SettingsService } from "./modules/settings/services/settings.service";
import { SettingsModel } from "./modules/settings/models/settings.model";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import "@progress/kendo-angular-intl/locales/ne/all"; // For Kendo Nepali Input
import { registerLocaleData } from "@angular/common";
import localeNe from "@angular/common/locales/ne";
registerLocaleData(localeNe, "ne");

export function initPreferenceData(preferenceService: PreferenceService) {
  return (): Observable<PreferenceModel> => {
    return preferenceService.getPreferenceData();
  };
}
export function initSettingsData(settingsService: SettingsService) {
  return (): Observable<SettingsModel> => {
    return settingsService.getSettingsData();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropDownsModule,
  ],
  providers: [
    PreferenceService,
    {
      provide: APP_INITIALIZER,
      useFactory: initPreferenceData,
      deps: [PreferenceService],
      multi: true,
    },
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initSettingsData,
      deps: [SettingsService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorsService,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: "ne" },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
