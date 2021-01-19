import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { Location } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { FormsService } from "@accSwift-modules/accswift-forms/services/forms.service";
@Component({
  selector: "accSwift-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  entryComponent = FooterComponent;
  pageTitle: string;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private settingsService: SettingsService,
    private preferenceService: PreferenceService,
    private formService: FormsService
  ) {
    this.settingsService.getSettings();
    this.preferenceService.getPerference();
    this.formService.getAllDropDownList();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let child = this.activatedRoute.firstChild;
        this.pageTitle = child.snapshot.data["breadcrumb"];
      }
    });
  }

  ngOnInit() {}

  isNotDashboard() {
    if (this.router.url.includes("dashboard")) return false;
    else return true;
  }

  logout(): void {
    this.router.navigate(["/login"]);
    this.cookieService.deleteAll("/");
    localStorage.clear();
    sessionStorage.clear();
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

  goBack(): void {
    this.location.back();
  }
}
