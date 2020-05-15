import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
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

export function initPreferenceData(preferenceService: PreferenceService) {
  return (): Observable<PreferenceModel> => {
    return preferenceService.getPreferenceData();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule, HttpClientModule],
  providers: [
    PreferenceService,
    {
      provide: APP_INITIALIZER,
      useFactory: initPreferenceData,
      deps: [PreferenceService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorsService,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
