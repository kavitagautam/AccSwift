import { Company } from "@accSwift-modules/company/models/company.model";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-group-balance-report",
  templateUrl: "./group-balance-report.component.html",
  styleUrls: ["./group-balance-report.component.scss"],
})
export class GroupBalanceReportComponent implements OnInit {
  companyInfo: Company;
  constructor() {}

  ngOnInit() {}
}
