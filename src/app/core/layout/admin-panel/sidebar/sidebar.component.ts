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
    {
      id: 3,
      displayName: "Edit",
      iconName: "fas fa-users",
      route: "/journal/edit"
    },

    {
      id: 3,
      displayName: "add",
      iconName: "fas fa-fw fa-chart-area",
      route: "/journal/add"
    },
    {
      id: 4,
      displayName: "Company",
      iconName: "fas fa-wrench",
      route: "/company"
    },
    {
      id: 5,
      displayName: "Transactions",
      iconName: "fas fa-wrench",
      route: ""
    },
    {
      id: 7,
      displayName: "Reports",
      iconName: "fas fa-fw fa-user",
      route: ""
    },
    {
      id: 7,
      displayName: "Prospect",
      iconName: "fas fa-users",
      route: ""
    },
    {
      id: 8,
      displayName: "Message",
      iconName: "fas fa-envelope",
      route: "/message"
    },
    // {
    //   id: 6,
    //   displayName: "Nested Dropdown",
    //   iconName: "fas fa-fw fa-user",
    //   children: [
    //     {
    //       displayName: "Speakers2",
    //       iconName: "group",
    //       children: [
    //         {
    //           displayName: "Michael Prentice",
    //           iconName: "person",
    //           route: "michael-prentice",
    //           children: [
    //             {
    //               displayName: "Create Enterprise UIs",
    //               iconName: "star_rate",
    //               route: "material-design"
    //             }
    //           ]
    //         },
    //         {
    //           displayName: "Stephen Fluin",
    //           iconName: "person",
    //           route: "stephen-fluin",
    //           children: [
    //             {
    //               displayName: "What's up with the Web?",
    //               iconName: "star_rate",
    //               route: "what-up-web"
    //             }
    //           ]
    //         },
    //         {
    //           displayName: "Mike Brocchi",
    //           iconName: "person",
    //           route: "mike-brocchi",
    //           children: [
    //             {
    //               displayName: "My ally, the CLI",
    //               iconName: "star_rate",
    //               route: "my-ally-cli"
    //             },
    //             {
    //               displayName: "Become an Angular Tailor",
    //               iconName: "star_rate",
    //               route: "become-angular-tailer"
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       displayName: "Sessions3",
    //       iconName: "speaker_notes",
    //       children: [
    //         {
    //           displayName: "Create Enterprise UIs",
    //           iconName: "star_rate",
    //           route: "material-design"
    //         },
    //         {
    //           displayName: "What's up with the Web?",
    //           iconName: "star_rate",
    //           route: "what-up-web"
    //         },
    //         {
    //           displayName: "My ally, the CLI",
    //           iconName: "star_rate",
    //           route: "my-ally-cli"
    //         },
    //         {
    //           displayName: "Become an Angular Tailor",
    //           iconName: "star_rate",
    //           route: "become-angular-tailer"
    //         }
    //       ]
    //     },
    //     {
    //       displayName: "Feedback3",
    //       iconName: "feedback",
    //       route: "feedback"
    //     }
    //   ]
    // }
  ];
  constructor() {}

  ngOnInit() {}

  toogleSideNav() {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  }
}
