import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import "@progress/kendo-angular-intl/locales/ne/all"; // For Kendo Nepali Input
import { registerLocaleData } from "@angular/common";
import localeNe from "@angular/common/locales/ne";
registerLocaleData(localeNe, "ne");

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: "ne" }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
