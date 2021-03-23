import { Component, OnInit } from "@angular/core";
import { environment } from "@env/environment.prod";
import { IntlService } from "@progress/kendo-angular-intl";
import { LocaleService } from "@app/core/services/locale/locale.services";

@Component({
  selector: "accswift-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
})
export class SideNavComponent implements OnInit {
  userName: string;
  userInfo: any;
  constructor() {}

  ngOnInit() {
    this.userName = "Admin";
    this.userInfo = {
      email_address: "admin@bentraytech.com",
    };
  }
  defaultImagePath = environment.defaultImagePath;
  imageUrl = environment.defaultImagePath;
  navItems = [
    {
      id: 1,
      displayName: "Dashboard",
      iconName: "fas fa-fw fa-tachometer-alt",
      route: "/dashboard",
    },
    {
      id: 2,
      displayName: "AR/AP",
      iconName: "fas fa-file-invoice",
      children: [
        {
          displayName: "Journal Voucher",
          iconName: "far fa-edit",
          route: "/journal",
        },
        {
          displayName: "Cash Receipt",
          iconName: "fa fa-money",
          route: "/cash-receipt",
        },
        {
          displayName: "Bank Receipt",
          iconName: "fas fa-money-check-alt",
          route: "/bank-receipt",
        },
        {
          displayName: "Cash Payment",
          iconName: "fas fa-rupee-sign",
          route: "/cash-payment",
        },

        {
          displayName: "Bank Payment",
          iconName: "fa fa-credit-card",
          route: "/bank-payment",
        },
        {
          displayName: "Bank Reconciliation",
          iconName: "fa fa-handshake-o",
          route: "/bank-reconciliation",
        },
        {
          displayName: "Contra Voucher",
          iconName: "fas fa-file-invoice",
          route: "/contra-voucher",
        },
      ],
    },
    {
      id: 3,
      displayName: "Chart Of Account",
      iconName: "fas fa-file-invoice-dollar",
      route: "/ledger",
    },
    {
      id: 4,
      displayName: "Company",
      iconName: "fas fa-building",
      route: "/company",
    },
    {
      id: 44,
      displayName: "POS",
      iconName: "fab fa-product-hunt",
      route: "/pos",
    },
    {
      id: 5,
      displayName: "Product",
      iconName: "fab fa-product-hunt",
      route: "/product",
    },
    {
      id: 55,
      displayName: "Project",
      iconName: "fab fa-product-hunt",
      route: "/project",
    },
    {
      id: 6,
      displayName: "Budget",
      iconName: "fas fa-file-invoice-dollar",
      route: "/budget",
    },
    {
      id: 15,
      displayName: "Unit",
      iconName: "fa fa-balance-scale",
      children: [
        {
          displayName: "Unit Maintenance",
          iconName: "fa fa-cogs",
          route: "/unit-maintenance",
        },
        {
          displayName: "Compound Unit",
          iconName: "fa fa-external-link",
          route: "/compound-unit",
        },
      ],
    },
    {
      id: 20,
      displayName: "User",
      iconName: "fa fa-users",
      route: "/user",
    },
    {
      id: 15,
      displayName: "Reports",
      iconName: "fa fa-file-pdf-o",
      children: [
        {
          displayName: "Trial Balance",
          iconName: "fa fa-file-excel-o",
          route: "/trail-balance",
        },
        {
          displayName: "Cash Flow Report",
          iconName: "fa fa-file-excel-o",
          route: "/cash-flow-report",
        },
        {
          displayName: "Kharid Khata",
          iconName: "fa fa-file-excel-o",
          route: "/kharid-khata",
        },
        {
          displayName: "Day Book",
          iconName: "fa fa-file-excel-o",
          route: "/day-book",
        },
        {
          displayName: "Stock Status",
          iconName: "fa fa-file-excel-o",
          route: "/stock-status",
        },
        {
          displayName: "Sales ",
          iconName: "fa fa-file-excel-o",
          route: "/sales-report",
        },
        {
          displayName: "Purchase",
          iconName: "fa fa-file-excel-o",
          route: "/purchase-report",
        },
        {
          displayName: "Ledger ",
          iconName: "fa fa-file-excel-o",
          route: "/ledger-report",
        },
        {
          displayName: "Profit Loss ",
          iconName: "fa fa-file-excel-o",
          route: "/profit-loss",
        },
        {
          displayName: "Balance Sheet ",
          iconName: "fa fa-file-excel-o",
          route: "/balance-sheet",
        },
      ],
    },
    {
      id: 11,
      displayName: "Depot",
      iconName: "fas fa-home",
      route: "/depot",
    },
    {
      id: 16,
      displayName: "Stock Transfer",
      iconName: "fas fa-repeat",
      route: "/stock-transfer",
    },
    {
      id: 9,
      displayName: "Purchase",
      iconName: "fa fa-shopping-cart",
      children: [
        {
          displayName: "Purchase Invoice",
          iconName: "far fa-edit",
          route: "/purchase-invoice",
        },
        {
          displayName: "Purchase Order",
          iconName: "fa fa-check-square-o",
          route: "/purchase-order",
        },
        {
          displayName: "Purchase Return",
          iconName: "fas fa-file-invoice",
          route: "/purchase-return",
        },
      ],
    },
    {
      id: 10,
      displayName: "Sales",
      iconName: "fa fa-truck",
      children: [
        {
          displayName: "Sales Invoice",
          iconName: "far fa-edit",
          route: "/sales-invoice",
        },
        {
          displayName: "Sales Order",
          iconName: "fa fa-check-square-o",
          route: "/sales-order",
        },
        {
          displayName: "Sales Return",
          iconName: "fas fa-file-invoice",
          route: "/sales-return",
        },
      ],
    },
    {
      id: 11,
      displayName: "Initialize",
      iconName: "fas fa-file-invoice",
      children: [
        {
          displayName: "Voucher Configuration",
          iconName: "far fa-edit",
          route: "/voucher-configuration",
        },
        {
          displayName: "Slabs",
          iconName: "fa fa-money",
          route: "",
        },
      ],
    },
    {
      id: 25,
      displayName: "Access Role",
      iconName: "fas fa-cogs",
      route: "/access-role",
    },
    {
      id: 7,
      displayName: "Preference",
      iconName: "fas fa-cogs",
      route: "/preference",
    },
    {
      id: 8,
      displayName: "Setting",
      iconName: "fas fa-tools",
      route: "/settings",
    },
  ];
}
