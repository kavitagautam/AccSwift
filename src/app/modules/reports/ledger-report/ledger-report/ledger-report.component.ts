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
import { LedgerMin } from "@app/modules/ledger/models/ledger.models";
import { LedgerGroup } from "@app/modules/ledger/models/ledger-group.model";

@Component({
  selector: "accSwift-ledger-report",
  templateUrl: "./ledger-report.component.html",
  styleUrls: ["./ledger-report.component.scss"],
})
export class LedgerReportComponent implements OnInit, AfterViewInit {
  @ViewChild("ledgerSettings") ledgerSettings;
  @ViewChild("ledgerDetails") ledgerDetails;
  baseURL: string;
  ledgerReportForms: FormGroup;
  projectName: string;
  toDateSelect: number;
  ledgerReportList: LedgerList[] = [];
  ledgerDetailsReportList: LedgerList[] = [];
  listLoading: boolean;
  listLedgerLoading: boolean;
  totalDebitAmount: number;
  totalCreditAmount: number;
  totalClosingBalance: string;
  accountLedger: boolean = false;
  accountGroup: boolean = false;
  dateCheckbox: boolean = true;
  ledgerMinList: LedgerMin[] = [];
  ledgerGroupList: LedgerGroup[] = [];
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
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
    this.getLedger();
    this.getLedgerGroup();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openLedgerSettings(this.ledgerSettings), 100);
  }

  buildLedgerReportForms(): void {
    this.ledgerReportForms = this._fb.group({
      LedgerID: [null],
      AccountGroupID: [null],
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
    this.ledgerReportForms.get("AccountGroupID").disable();
  }

  enableDate(): void {
    if (this.ledgerReportForms.get("IsDateRange").value) {
      this.dateCheckbox = false;
      this.ledgerReportForms.get("ToDate").enable();
      this.ledgerReportForms.get("FromDate").enable();
    } else {
      this.dateCheckbox = true;
      this.ledgerReportForms.get("ToDate").disable();
      this.ledgerReportForms.get("FromDate").disable();
    }
  }

  getLedger(): void {
    this.reportService.getLedgerMin().subscribe((response) => {
      this.ledgerMinList = response.Entity;
    });
  }

  getLedgerGroup(): void {
    this.reportService.getLedgerGroup().subscribe((response) => {
      this.ledgerGroupList = response.Entity;
    });
  }

  openLedgerSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }
  openLedgerDetailsPopUP(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openVoucherDetails(e, data): void {
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

  openLedgerDetails(e, data): void {
    this.openLedgerDetailsPopUP(this.ledgerDetails);
    const obj = {
      LedgerID: data.ID,
      AccountGroupID: this.ledgerReportForms.get("AccountGroupID").value,
      IsShowRemarks: this.ledgerReportForms.get("IsShowRemarks").value,
      IsDetails: true,
      IsShowZeroBalance: this.ledgerReportForms.get("IsShowZeroBalance").value,
      ProjectID: this.ledgerReportForms.get("ProjectID").value,
      AccClassID: this.ledgerReportForms.get("AccClassID").value,
    };
    this.listLedgerLoading = true;
    this.reportService.getLedgerReports(obj).subscribe(
      (response) => {
        this.ledgerDetailsReportList = response.Entity.Entity;
      },
      (error) => {
        this.listLedgerLoading = false;
      },
      () => {
        this.listLedgerLoading = false;
      }
    );
  }

  changeProject(): void {
    const projectID = this.ledgerReportForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  accountLedgerCheck(): void {
    this.accountGroup = false;
    if (this.accountLedger == true) {
      this.accountLedger = false;
      this.ledgerReportForms.get("LedgerID").disable();
    } else {
      this.accountLedger = true;
    }
    this.ledgerReportForms.get("LedgerID").enable();
  }

  accountGroupCheck(): void {
    this.accountLedger = false;
    if (this.accountGroup == true) {
      this.accountGroup = false;
      this.ledgerReportForms.get("AccountGroupID").disable();
    } else {
      this.accountGroup = true;
    }
    this.ledgerReportForms.get("AccountGroupID").enable();
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.ledgerReportForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.ledgerReportForms.get("AccClassID").setValue([id]);
    }
  }

  today(): void {
    const today = new Date();
    this.ledgerReportForms.get("ToDate").setValue(today);
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
