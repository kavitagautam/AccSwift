import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";

@Component({
  selector: "accswift-side-nav",
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
          displayName: "Cash Receipt",
          iconName: "fas fa-money-bill",
          route: "/cash-receipt"
        },
        {
          displayName: "Bank Receipt",
          iconName: "fas fa-file-invoice",
          route: "/bank-receipt"
        },
        {
          displayName: "Cash Payment",
          iconName: "fas fa-file-invoice-dollar",
          route: "/cash-payment"
        },
        {
          displayName: "Bank Payment",
          iconName: "fas fa-file-invoice-dollar",
          route: "/bank-payment"
        },
        {
          displayName: "Bank Reconciliation",
          iconName: "fas fa-file-invoice-dollar",
          route: "/bank-reconciliation"
        },
        {
          displayName: "Contra Voucher",
          iconName: "fas fa-file-invoice",
          route: "/contra-voucher"
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
      displayName: "Budget",
      iconName: "fas fa-file-invoice-dollar",
      route: "/budget"
    },
    {
      id: 9,
      displayName: "Purchase",
      iconName: "fa fa-shopping-cart",
      children: [
        {
          displayName: "Purchase Invoice",
          iconName: "far fa-edit",
          route: "/purchase-invoice"
        },
        {
          displayName: "Purchase Order",
          iconName: "fa fa-check-square-o",
          route: "/purchase-order"
        },
        {
          displayName: "Purchase Return",
          iconName: "fas fa-file-invoice",
          route: "/purchase-return"
        }
      ]
    },
    {
      id: 10,
      displayName: "Sales",
      iconName: "fa fa-truck",
      children: [
        {
          displayName: "Sales Invoice",
          iconName: "far fa-edit",
          route: "/sales-invoice"
        },
        {
          displayName: "Sales Order",
          iconName: "fa fa-check-square-o",
          route: "/sales-order"
        },
        {
          displayName: "Sales Return",
          iconName: "fas fa-file-invoice",
          route: "/sales-return"
        }
      ]
    },
    {
      id: 7,
      displayName: "Preference",
      iconName: "fas fa-cogs",
      route: "/preference"
    },
    {
      id: 8,
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
