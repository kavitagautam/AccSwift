import { Component } from "@angular/core";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";

@Component({
  selector: "accSwift-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "AccSwift";
  constructor(
    private settingsService: SettingsService,
    private preferenceService: PreferenceService
  ) {
    this.settingsService.getSettingsData();
    this.preferenceService.getPreferenceData();
  }
}
