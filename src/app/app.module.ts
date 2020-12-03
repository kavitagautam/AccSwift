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
import "@lib/ne/all"; // For Kendo Nepali Input
import { registerLocaleData } from "@angular/common";
// import localeNe from "@angular/common/locales/ne";
import { LocaleService } from "./core/services/locale/locale.services";
import { CookieService } from "ngx-cookie-service";
import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { environment } from "@env/environment";
import localeGB from "@angular/common/locales/en-GB";
import localefr from "@angular/common/locales/fr";
import "@progress/kendo-angular-intl/locales/en-GB/all";
import "@progress/kendo-angular-intl/locales/fr/all";

import "hammerjs";

// registerLocaleData(localeNe, "ne");
registerLocaleData(localefr, "fr");

registerLocaleData(localeGB, "en_GB");

const loggerPluginOptions = {
  logger: console,
  collapsed: false,
};

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

export function localFunction(settingsService: SettingsService) {
  var localeId: string;

  if (settingsService && settingsService.settings.DEFAULT_CURRENCY.Value == 1) {
    this.localeId = "ne";
  }
  if (settingsService && settingsService.settings.DEFAULT_CURRENCY.Value == 2) {
    localeId = "en_US";
  }
  if (
    settingsService &&
    settingsService.settings.DEFAULT_CURRENCY.Value == 249
  ) {
    localeId = "fr-FR";
  }
  if (
    settingsService &&
    settingsService.settings.DEFAULT_CURRENCY.Value == 260
  ) {
    localeId = "en_GB";
  }
  return localeId;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
    }),
    NgxsLoggerPluginModule.forRoot(loggerPluginOptions),
    NgxsReduxDevtoolsPluginModule.forRoot()
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
    // { provide: LOCALE_ID, useValue: "ne" },
    // {
    //   provide: LOCALE_ID,
    //   deps: [],
    //   useFactory: localFunction,
    // },
    CookieService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
