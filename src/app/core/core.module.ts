import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutModule } from "./layout/layout.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ToastrModule } from "ngx-toastr";
import { LoaderModule } from "./loader/loader.module";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
@NgModule({
  declarations: [],
  imports: [
    LoaderModule,
    CommonModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [PreferenceService, SettingsService],
  exports: [LayoutModule, LoaderModule],
})
export class CoreModule {}
