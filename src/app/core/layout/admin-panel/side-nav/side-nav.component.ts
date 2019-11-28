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
      displayName: "AR/AP",
      iconName: "fas fa-file-invoice",
      children: [
        {
          displayName: "Journal Voucher",
          iconName: "far fa-edit",
          route: "/journal"
        },
        {
          displayName: "Cash Receipts",
          iconName: "fas fa-money-bill",
          route: "/cash"
        },
        {
          displayName: "Bank Receipts",
          iconName: "fas fa-file-invoice",
          route: "/bank"
        },
        {
          displayName: "Bank Payments",
          iconName: "fas fa-file-invoice-dollar",
          route: "/bankPayments"
        },
        {
          displayName: "Contra Voucher",
          iconName: "fas fa-file-invoice",
          route: "/contra"
        }
      ]
    },
    {
      id: 3,
      displayName: "Ledger",
      iconName: "fas fa-file-invoice-dollar",
      route: "/ledger"
    },
    {
      id: 4,
      displayName: "Company",
      iconName: "fas fa-building",
      route: "/company"
    },
    {
      id: 5,
      displayName: "Product",
      iconName: "fab fa-product-hunt",
      route: "/product"
    },
    {
      id: 6,
      displayName: "Preference",
      iconName: "fas fa-cogs",
      route: "/preference"
    },
    {
      id: 7,
      displayName: "Setting",
      iconName: "fas fa-tools",
      route: "/settings"
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
