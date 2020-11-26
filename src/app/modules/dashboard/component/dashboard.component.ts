import { Component, OnInit } from "@angular/core";


@Component({
  selector: "accSwift-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  
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
  constructor() {}

  ngOnInit() {}
}
