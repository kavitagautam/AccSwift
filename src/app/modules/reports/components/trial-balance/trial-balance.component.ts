import { Component, OnInit } from "@angular/core";
import {
  trailBalanceData,
  TrailBalance,
} from "../../models/trail-balance.model";
import { ReportsService } from "../../services/reports.service";
@Component({
  selector: "accSwift-trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["./trial-balance.component.scss"],
})
export class TrialBalanceComponent implements OnInit {
  groupBalanceList: TrailBalance;
  listLoading: boolean;
  constructor(private reportService: ReportsService) {}

  ngOnInit() {
    this.getGroupBalance();
  }
  getGroupBalance(): void {
    this.listLoading = true;
    this.reportService.getGroupBalanceData().subscribe(
      (response) => {
        this.groupBalanceList = response.Entity;
        console.log("Group Balance " + this.groupBalanceList);
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }
}
