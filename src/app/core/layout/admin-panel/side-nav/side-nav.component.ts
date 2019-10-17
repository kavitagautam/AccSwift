import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";

@Component({
  selector: "simpliflysaas-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"]
})
export class SideNavComponent implements OnInit {
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.defaultImagePath;
  navItems = [
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fas fa-fw fa-tachometer-alt",
      route: "/dashboard"
    },
    {
      id: 2,
      displayName: "Journal",
      iconName: "far fa-edit",
      route: "/journal"
    },
    {
      id: 3,
      displayName: "Ledger",
      iconName: "fas fa-fw fa-chart-area",
      route: "/ledger"
    }
  ];

  userName: string;
  userInfo: any;
  constructor() {}

  ngOnInit() {
    this.userName = "Admin";
    this.userInfo = {
      email_address: "admin@bentraytech.com"
    };
  }
}
