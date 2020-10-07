import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReportsService } from "../../services/reports.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { LedgerList } from "../../models/ledger.reports.model";
import { LedgerMin } from "@accSwift-modules/ledger/models/ledger.models";
import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@Component({
  selector: "accSwift-ledger-report",
  templateUrl: "./ledger-report.component.html",
  styleUrls: ["./ledger-report.component.scss"],
})
export class LedgerReportComponent implements OnInit, AfterViewInit {
  ledgerReportForms: FormGroup;
  projectName: string;

  ledgerReportList: LedgerList[] = [];
  listLoading: boolean;
  totalDebitAmount: number;
  totalCreditAmount: number;
  totalClosingBalance: string;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  modalRefLedger: BsModalRef;
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildLedgerReportForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openLedgerSettings(), 100);
  }

  buildLedgerReportForms(): void {
    this.ledgerReportForms = this._fb.group({
      LedgerID: [null],
      GroupID: [null],
      IsShowRemarks: [false],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [],
      FromDate: [""],
      ToDate: [""],
    });
    this.ledgerReportForms.get("LedgerID").disable();
    this.ledgerReportForms.get("GroupID").disable();
  }

  openLedgerSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.ledgerReportForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });
    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.listLoading = true;
        this.reportService.getLedgerReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.ledgerReportList = response.Entity.Entity;
            this.totalDebitAmount = response.Entity.TotalDebitAmount;
            this.totalCreditAmount = response.Entity.TotalCreditAmount;
            this.totalClosingBalance = response.Entity.ClosingBalance;
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

  openLedgerDetails(e, data): void {
    const obj = {
      LedgerID: data.ID,
      IsDetails: this.ledgerReportForms.get("IsDetails").value,
      IsShowZeroBalance: this.ledgerReportForms.get("IsShowZeroBalance").value,
      FromDate: this.ledgerReportForms.get("FromDate").value,
      ToDate: this.ledgerReportForms.get("ToDate").value,
      IsDateRange: this.ledgerReportForms.get("IsDateRange").value,
      ProjectID: this.ledgerReportForms.get("ProjectID").value,
      AccClassID: this.ledgerReportForms.get("AccClassID").value,
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

  showReport(): void {
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getLedgerReports(JSON.stringify(this.ledgerReportForms.value))
      .subscribe(
        (response) => {
          this.ledgerReportList = response.Entity.Entity;
          this.totalDebitAmount = response.Entity.TotalDebitAmount;
          this.totalCreditAmount = response.Entity.TotalCreditAmount;
          this.totalClosingBalance = response.Entity.ClosingBalance;
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
