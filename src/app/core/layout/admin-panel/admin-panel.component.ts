import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { IconConst } from "@shared/constants/icon.constant";
@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"]
})
export class AdminPanelComponent implements OnInit {
  entryComponent = FooterComponent;
  iconConst = IconConst;
  pageTitle: string;

  // list of items at the top of the main container
  menuItems = [
    {
      name: "Dashboard",
      iconName: this.iconConst.DASHBOARD,
      route: "/dashboard"
    },
    {
      name: "Suspect",
      iconName: this.iconConst.SUSPECT,
      route: "/suspect"
    },
    {
      name: "Prospect",
      iconName: this.iconConst.PROSPECT,
      route: "/prospect"
    },
    {
      name: "Client",
      iconName: this.iconConst.CLIENT,
      route: "/client"
    },
    {
      name: "On Board Candidate",
      iconName: this.iconConst.ON_BOARD_CANDIDATE,
      flex: 3
    },
    {
      name: "Invoice Billing",
      iconName: this.iconConst.PROSPECT,
      flex: 2
    },
    {
      name: "Generate Tokens",
      iconName: this.iconConst.DASHBOARD,
      flex: 2
    },
    {
      name: "Export Invoice",
      iconName: this.iconConst.EXPORT_INVOICE,
      flex: 2
    },
    {
      name: "Task",
      iconName: this.iconConst.TASK
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.getPageTitle();
  }

  getPageTitle() {
    if (this.router.url.includes("admin")) this.pageTitle = "Admin";
    else if (this.router.url.includes("client")) this.pageTitle = "Client";
    else if (this.router.url.includes("class-code"))
      this.pageTitle = "Class Code";
    else if (this.router.url.includes("staffing-company"))
      this.pageTitle = "Staffing Company";
  }

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
}
