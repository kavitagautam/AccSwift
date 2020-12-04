import { Component, OnInit } from "@angular/core";
import { AccTransactService } from "@accSwift-modules/dashboard/services/dashboard-service/acc-transact.service";
import { AccountTransact , AccountTransactRootModel , Account , AccountRootModel , InvTransact , InvTransactRootModel} from "@accSwift-modules/dashboard/models/dashboard-model.";


@Component({
  selector: "accSwift-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  
  boxes: any[] = [
    {
      no:2, title:"Sales", amount:"Rs.4,00/Rs.9,900.00"
    },
    {
      no:10, title:"Purchase", amount:"Rs.8,00/Rs.9,900.00"
    },
    {
      no:3, title:"Products", amount:"Rs.6,00/Rs.9,900.00"
    },
    {
      no:1, title:"Revenue", amount:"Rs.1,00/Rs.9,900.00"
    }

  ]

  getBgcolor(title)
  {
    switch(title)
    {
      case "Sales":
      return "rgb(168,210,223)";

      case "Purchase":
      return "rgb(244,245,144)";

      case "Products":
      return "rgb(139,231,139)";

      case "Revenue":
      return "rgb(242,211,214)";
    }
  }
  

  voucher = [
    {
      "VoucherNo": 17,
      "Date": new Date(1996, 8, 20),
      "ProjectName": "All Project",
      "Series": "Main",
      "Remarks": "Being Cash deposited into bank."
    },
    {
      "VoucherNo": 18,
      "Date": new Date(1996, 8, 20),
      "ProjectName": "All Project",
      "Series": "Main",
      "Remarks": "Being Cash deposited into bank."
    },
    {
      "VoucherNo": 19,
      "Date": new Date(1996, 8, 20),
      "ProjectName": "All Project",
      "Series": "Main",
      "Remarks": "Being Cash deposited into bank."
    },
    {
      "VoucherNo": 20,
      "Date": new Date(1996, 8, 20),
      "ProjectName": "All Project",
      "Series": "Main",
      "Remarks": "Being Cash deposited into bank."
    }

  ];

  public gridView: any[] = this.voucher;

  constructor(private _AccTransactService: AccTransactService) {}

  AccountTransactionList: AccountTransact[]=[];
  Accounts: Account[]=[];
  InvTransactionList: InvTransact[]=[];
  ngOnInit() {
    this._AccTransactService.getAccountTransact()
    .subscribe
    (
      (response: AccountTransactRootModel)=>
     {
       this.AccountTransactionList = response.Entity;
     }
    );

    this._AccTransactService.getaccounts()
    .subscribe
    (
      (response: AccountRootModel)=>
     {
       this.Accounts = response.Entity;
     }
    );

    this._AccTransactService.getInvTransact()
    .subscribe
    (
      (response: InvTransactRootModel)=>
     {
       this.InvTransactionList = response.Entity;
     }
    );

  }
}
