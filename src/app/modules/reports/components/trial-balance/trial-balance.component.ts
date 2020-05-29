import { Component, OnInit } from "@angular/core";
import {
  trailBalanceData,
  TrailBalance,
  Group,
} from "../../models/trail-balance.model";
import { ReportsService } from "../../services/reports.service";
@Component({
  selector: "accSwift-trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["./trial-balance.component.scss"],
})
export class TrialBalanceComponent implements OnInit {
  groupBalanceList: Group[] = [];
  listLoading: boolean;

  previousYearPLDR: number;
  previousYearPLCR: number;
  openingDR: number;
  openingCR: number;
  trialTotalDR: number;
  trialTotalCR: number;
  constructor(private reportService: ReportsService) {}

  ngOnInit() {
    this.getGroupBalance();
  }
  getGroupBalance(): void {
    this.listLoading = true;
    this.reportService.getGroupBalanceData().subscribe(
      (response) => {
        this.groupBalanceList = response.Entity.Entity;

        this.previousYearPLDR = 0;
        this.previousYearPLCR = 0;
        this.openingDR = response.Entity.DiffInOpeningDr;
        this.openingCR = response.Entity.DiffInOpeningCr;
        this.trialTotalDR = response.Entity.GrandTotalDr;
        this.trialTotalCR = response.Entity.GrandTotalCr;
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
