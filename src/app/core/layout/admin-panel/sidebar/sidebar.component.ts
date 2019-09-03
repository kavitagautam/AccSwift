import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  navItems = [
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fas fa-fw fa-tachometer-alt",
      route: "/dashboard"
    },
    {
      id: 2,
      displayName: "Journals",
      iconName: "far fa-edit",
      route: "/journal"
    },
    // {
    //   id: 3,
    //   displayName: "Edit",
    //   iconName: "fas fa-users",
    //   route: "/journal/edit"
    // },

    // {
    //   id: 3,
    //   displayName: "add",
    //   iconName: "fas fa-fw fa-chart-area",
    //   route: "/journal/add"
    // },
    {
      id: 4,
      displayName: "Company",
      iconName: "fas fa-wrench",
      route: "/company"
    },
    {
      id: 7,
      displayName: "Reports",
      iconName: "fa fa-file-archive-o",
    },
    {
      id: 8,
      displayName: "Settings",
      iconName: "fa fa-cogs",
    },
    {
      id: 6,
      displayName: "Transaction",
      iconName: "fa fa-usd",
      children: [
        {
          displayName: "Cash",
          iconName: "fa fa-money",
            },
        {
          displayName: "Bank",
          iconName: "speaker_notes",
        },
        {
          displayName: "Sales",
          iconName: "feedback",
          route: "feedback"
        },
        {
          displayName: "Purchase",
          iconName: "feedback",
          route: "feedback"
        }
      ]
    }
    
  ];
  constructor() {}

  ngOnInit() {}

  toogleSideNav() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  }
}
