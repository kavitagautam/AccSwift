import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { Location } from "@angular/common";
@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"]
})
export class AdminPanelComponent implements OnInit {
  entryComponent = FooterComponent;
  pageTitle: string;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
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
    localStorage.clear();
  }

  scrollToTop(): void {
    window.scroll(0, 0);
  }

  goBack(): void {
    this.location.back();
  }
}
