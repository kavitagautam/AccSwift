import { Component, OnInit } from "@angular/core";
import { AccTransactService } from '@app/core/services/acc-transact/acc-transact.service';
import { Fields , FieldsRootModel} from "@app/modules/accswift-shared/models/acc-transact.model.ts";
import { InvTransactService } from '@app/core/services/inv-transact/inv-transact.service';
import { Items , ItemsRootModel} from "@app/modules/accswift-shared/models/inv-transact.model.ts";

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

  constructor(private _AccTransactService: AccTransactService ,
    private _InvTransactService: InvTransactService) {}

  lstfields: Fields[]=[];
  lstitems: Items[]=[];
  ngOnInit() {
    this._AccTransactService.getfields()
    .subscribe
    (
      (response: FieldsRootModel)=>
     {
       this.lstfields = response.Entity;
     }
    );

    this._InvTransactService.getitems()
    .subscribe
    (
      (response: ItemsRootModel)=>
     {
       this.lstitems = response.Entity;
     }
    );
  }

}
