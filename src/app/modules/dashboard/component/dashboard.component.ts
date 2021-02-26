import { Component, OnInit } from "@angular/core";
import {
  AccountTransact,
  AccountTransactRootModel,
  Account,
  AccountRootModel,
  InvTransact,
  InvTransactRootModel,
  GeneralSummary,
  GeneralSummaryRootModel,
  SalesMonthly,
  SalesMonthlyRootModel,
  PurchaseMonthly,
  PurchaseMonthlyRootModel
} from "@accSwift-modules/dashboard/models/dashboard-model.";
import { DashBoardService } from "../services/dashboard.service";

@Component({
  selector: "accSwift-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  
  getBgColor(Title) {
    switch (Title) {
      case "Sales":
        return "rgb(168,210,223)";

      case "Purchase":
        return "rgb(244,245,144)";

      case "Profit":
        return "rgb(139,231,139)";

      case "Bank Balance":
        return "rgb(242,211,214)";
    }
  }
  invoice = [
    {
      InvoiceBalance: 1000,
      Remarks: "Invoice remarks",
    },
    {
      InvoiceBalance: 1000,
      Remarks: "Invoice remarks",
    },
    {
      InvoiceBalance: 1000,
      Remarks: "Invoice remarks",
    },
    {
      InvoiceBalance: 1000,
      Remarks: "Invoice remarks",
    },
    {
      InvoiceBalance: 1000,
      Remarks: "Invoice remarks",
    },
  ];

  voucher = [
    {
      VoucherNo: 17,
      Date: new Date(1996, 8, 20),
      ProjectName: "All Project",
      Series: "Main",
      Remarks: "Being Cash deposited into bank.",
    },
    {
      VoucherNo: 18,
      Date: new Date(1996, 8, 20),
      ProjectName: "All Project",
      Series: "Main",
      Remarks: "Being Cash deposited into bank.",
    },
    {
      VoucherNo: 19,
      Date: new Date(1996, 8, 20),
      ProjectName: "All Project",
      Series: "Main",
      Remarks: "Being Cash deposited into bank.",
    },
    {
      VoucherNo: 20,
      Date: new Date(1996, 8, 20),
      ProjectName: "All Project",
      Series: "Main",
      Remarks: "Being Cash deposited into bank.",
    },
  ];

  public gridView: any[] = this.voucher;
  public grdView: any[] = this.invoice;

  constructor(private dashBoardService: DashBoardService) {}

  accountTransactionList: AccountTransact[] = [];
  Accounts: Account[] = [];
  invTransactionList: InvTransact[] = [];
  generalSummaryList: GeneralSummary[] = [];
  salesMonthly: SalesMonthly[] = [];
  purchaseMonthly: PurchaseMonthly[] = [];
  ngOnInit() {
    // setTimeout(() => {
    //   console.log("reload");
    //   location.reload();
    // }, 10);
    this.dashBoardService
      .getAccountTransact()
      .subscribe((response: AccountTransactRootModel) => {
        this.accountTransactionList = response.Entity;
      });

    this.dashBoardService
      .getAccounts()
      .subscribe((response: AccountRootModel) => {
        this.Accounts = response.Entity;
      });

    this.dashBoardService
      .getInvTransact()
      .subscribe((response: InvTransactRootModel) => {
        this.invTransactionList = response.Entity;
      });

    this.dashBoardService
      .getGeneralSummary()
      .subscribe((response: GeneralSummaryRootModel) => {
        this.generalSummaryList = response.Entity;
      });
      
    this.dashBoardService
    .getSalesMonthly()
    .subscribe((response: SalesMonthlyRootModel) => {
      this.salesMonthly = response.Entity;
    });

    this.dashBoardService
    .getPurchaseMonthly()
    .subscribe((response: PurchaseMonthlyRootModel) => {
      this.purchaseMonthly = response.Entity;
    });
  }
}
