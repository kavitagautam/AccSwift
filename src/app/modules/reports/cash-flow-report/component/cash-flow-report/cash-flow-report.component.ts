import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AccountDetails } from '@accSwift-modules/reports/models/cash-flow.model';
import { GroupBalanceReportComponent } from '@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component';
import { LedgerDetailReportsComponent } from '@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component';


@Component({
  selector: 'accSwift-cash-flow-report',
  templateUrl: './cash-flow-report.component.html',
  styleUrls: ['./cash-flow-report.component.scss']
})
export class CashFlowReportComponent implements OnInit {

  cashFlowReportForms: FormGroup;
  accountDetails: AccountDetails[] = [];
  totalInFlowAmount: number;
  totalOutFlowAmount: number;
  modalRef: BsModalRef;
  modalRefLedger: BsModalRef
  baseURL: string;
  listLoading: boolean;

  constructor(
    private modalService: BsModalService,
    private reportService: ReportsService,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    this.buildCashFlowReportForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  buildCashFlowReportForms(): void {
    this.cashFlowReportForms = this._fb.group({
      Type: [""],
      ID: [null],
      GroupID: 0,
      IsGroupWise: [false],
      IsShowLedger: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      IsShowSecondLevelGroupDtl: [false],
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}],
      IsDateRange: [false],
      ProjectID: [this.preferenceService.preferences ? this.preferenceService.preferences.DEFAULT_PROJECT.Value: null],
      AccClassID: [""]
    })
  }

  openCashFlowReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.cashFlowReportForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });

    this.modalRef.content.onSubmit.subscribe((data) => {
    if (data) {

    this.reportService.getCashFlowReports(JSON.stringify(data)).subscribe(
      (response) => {
        this.accountDetails = response.Entity.Entity;
        this.totalInFlowAmount = response.Entity.TotalInFlowAmount;
        this.totalOutFlowAmount = response.Entity.TotalOutFlowAmount;
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }
});

    this.modalRef.content.onClose.subscribe((data) => {
      this.showCashFlowReport();
    });
  }

  showCashFlowReport(): void {
    this.listLoading = true;
    this.reportService.getCashFlowReports(this.cashFlowReportForms.value).subscribe(
      (response) => {
        this.accountDetails = response.Entity.Entity;
      },
      (error) => {
        this.listLoading = false;
        this.modalRef.hide();
      },
      () => {
        this.listLoading = false;
        this.modalRef.hide();
      }
    );
  }

  openGroupDetails(event, data): void {
    if(data.Type === "GROUP") {
      this.cashFlowReportForms.get("Type").setValue(data.Type);
      this.cashFlowReportForms.get("GroupID").setValue(data.ID);
      this.reportService.getGroupBalanceDetails(this.cashFlowReportForms.value).subscribe((response) => {
        this.modalRef = this.modalService.show(GroupBalanceReportComponent, {
          initialState: {
            settingsForms: this.cashFlowReportForms,
            companyInfo: response.Entity.Company,
            groupBalanceList: response.Entity.Entity,
            totalGroupClosingBalance: response.Entity.ClosingBalance,
          },
          ignoreBackdropClick: true,
          animated: true,
          keyboard: true,
          class: "modal-lg",
        });
      });
    }

    if(data.Type === "LEDGER") {
      const obj = {
        LedgerID: data.ID,
        IsDetails: this.cashFlowReportForms.get("IsDetails").value,
        IsShowZeroBalance: this.cashFlowReportForms.get("IsShowZeroBalance")
          .value,
        FromDate: this.cashFlowReportForms.get("FromDate").value,
        ToDate: this.cashFlowReportForms.get("ToDate").value,
        IsDateRange: this.cashFlowReportForms.get("IsDateRange").value,
        ProjectID: this.cashFlowReportForms.get("ProjectID").value,
        AccClassID: this.cashFlowReportForms.get("AccClassID").value,
      }
      this.reportService.getLedgerTransactionDetails(obj).subscribe((response) => {
        this.modalRefLedger = this.modalService.show(LedgerDetailReportsComponent, {
          initialState: {
            ledgerDetailsList: response.Entity.Entity,
          },
          ignoreBackdropClick: true,
          animated: true,
          keyboard: true,
          class: "modal-lg",
        });
      });
    }
  }

}
