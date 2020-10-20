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
  baseURL: string;

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
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.buildLedgerReportForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
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

  openVoucherDetails(event, data): void {
    if (data.VoucherType === "JRNL") {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/journal/edit", data.RowID])
      );
      window.open(this.baseURL + "journal/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "BANK_PMNT") {
      window.open(this.baseURL + "bank-payment/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "CASH_PMNT") {
      window.open(this.baseURL + "cash-payment/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "BANK_RCPT") {
      window.open(this.baseURL + "bank-receipt/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "BRECON") {
      window.open(
        this.baseURL + "bank-reconciliation/edit/" + data.RowID,
        "_blank"
      );
    }
    if (data.VoucherType === "CNTR") {
      window.open(this.baseURL + "contra-voucher/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "BANK_RCPT") {
      window.open(this.baseURL + "bank-receipt/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "CASH_RCPT") {
      window.open(this.baseURL + "cash-receipt/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "SALES") {
      window.open(this.baseURL + "sales-invoice/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "SLS_RTN") {
      window.open(this.baseURL + "sales-return/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "SLS_ORDER") {
      window.open(this.baseURL + "sales-order/edit/" + data.RowID, "_blank");
    }

    if (data.VoucherType === "PURCH") {
      window.open(
        this.baseURL + "purchase-invoice/edit/" + data.RowID,
        "_blank"
      );
    }
    if (data.VoucherType === "PURCH_RTN") {
      window.open(
        this.baseURL + "purchase-return/edit/" + data.RowID,
        "_blank"
      );
    }
    if (data.VoucherType === "PURCH_ORDER") {
      window.open(this.baseURL + "purchase-order/edit/" + data.RowID, "_blank");
    }
  }
}
