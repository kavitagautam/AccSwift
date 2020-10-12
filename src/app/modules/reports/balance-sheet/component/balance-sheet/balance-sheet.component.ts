import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import {
  BalanceSheet,
  GroupList,
} from "@accSwift-modules/reports/models/balance.sheet.model";
import { Location } from "@angular/common";
import { Ledger } from "@accSwift-modules/ledger/models/ledger.models";
import { Company } from "@accSwift-modules/company/models/company.model";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { LedgerTransaction } from "@accSwift-modules/reports/models/ledger-transaction.model";
import { GroupBalanceReportComponent } from "@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@Component({
  selector: "accSwift-balance-sheet",
  templateUrl: "./balance-sheet.component.html",
  styleUrls: ["./balance-sheet.component.scss"],
})
export class BalanceSheetComponent implements OnInit {
  groupBalanceList: GroupList[] = [];
  projectName: string;
  balanceSheetForms: FormGroup;
  listLoading: boolean;
  balanceSheetList: BalanceSheet[] = [];
  modalRef: BsModalRef;
  modalRefLedger: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildBalanceSheetForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openBalanceSheetSettings(), 100);
  }

  buildBalanceSheetForms(): void {
    this.balanceSheetForms = this._fb.group({
      Type: [""],
      ID: [null],
      DisplayFormat: ["TFormat"],
      LedgerID: [null],
      GroupID: [null],
      IsShowRemarks: [false],
      FromDate: [{ value: "", disabled: true }],
      ToDate: [{ value: "", disabled: true }],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [""],
    });
  }

  openBalanceSheetSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.balanceSheetForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    // this.modalRef.content.projectName.subscribe((data) => {
    //   this.projectName = data;
    // });
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });
    //this.modalRef = this.modalService.show(template, this.config);

    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.listLoading = true;
        this.reportService
          .getBalanceSheetReports(JSON.stringify(data))
          .subscribe(
            (response) => {
              this.balanceSheetList = response.Entity.Entity;
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
      this.showReport();
    });
  }

  openBalanceDrillDown(event, data): void {
    if (data.Type === "GROUP") {
      this.balanceSheetForms.get("Type").setValue(data.Type);
      this.balanceSheetForms.get("GroupID").setValue(data.ID);
      this.reportService
        .getGroupBalanceDetails(this.balanceSheetForms.value)
        .subscribe((response) => {
          this.modalRef = this.modalService.show(GroupBalanceReportComponent, {
            initialState: {
              settingsForms: this.balanceSheetForms,
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
    if (data.Type === "LEDGER") {
      const obj = {
        LedgerID: data.ID,
        IsDetails: this.balanceSheetForms.get("IsDetails").value,
        IsShowZeroBalance: this.balanceSheetForms.get("IsShowZeroBalance")
          .value,
        FromDate: this.balanceSheetForms.get("FromDate").value,
        ToDate: this.balanceSheetForms.get("ToDate").value,
        IsDateRange: this.balanceSheetForms.get("IsDateRange").value,
        ProjectID: this.balanceSheetForms.get("ProjectID").value,
        AccClassID: this.balanceSheetForms.get("AccClassID").value,
      };
      this.reportService
        .getLedgerTransactionDetails(obj)
        .subscribe((response) => {
          this.modalRefLedger = this.modalService.show(
            LedgerDetailReportsComponent,
            {
              initialState: {
                ledgerDetailsList: response.Entity.Entity,
              },
              ignoreBackdropClick: true,
              animated: true,
              keyboard: true,
              class: "modal-lg",
            }
          );
        });
    }
  }

  showReport(): void {
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getBalanceSheetReports(JSON.stringify(this.balanceSheetForms.value))
      .subscribe(
        (response) => {
          this.balanceSheetList = response.Entity.Entity;
        },
        (error) => {
          this.listLoading = false;
        },
        () => {
          this.listLoading = false;
        }
      );
  }

  cancel(): void {
    this.showReport();
  }
}
