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

@Component({
  selector: "accSwift-balance-sheet",
  templateUrl: "./balance-sheet.component.html",
  styleUrls: ["./balance-sheet.component.scss"],
})
export class BalanceSheetComponent implements OnInit {
  @ViewChild("balanceSheetSettings") balanceSheetSettings;
  @ViewChild("groupBalance") groupBalance;
  @ViewChild("ledgerDetails") ledgerDetails;

  groupBalanceList: GroupList[] = [];
  ledgerDetailsList: Ledger[] = [];
  companyInfo: Company;
  totalGroupClosingBalance: string;
  groupLoading: boolean;
  ledgerLoading: boolean;
  baseURL: string;
  toDateSelect: number;
  projectName: string;
  balanceSheetForms: FormGroup;
  listLoading: boolean;
  dateCheckbox: boolean = true;
  balanceSheetList: BalanceSheet[] = [];
  modalRef: BsModalRef;
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
    private modalService: BsModalService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.buildBalanceSheetForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => this.openBalanceSheetSettings(this.balanceSheetSettings),
      100
    );
  }

  buildBalanceSheetForms(): void {
    this.balanceSheetForms = this._fb.group({
      Type: [""],
      ID: [null],
      DisplayFormat: ["TFormat"],
      LedgerID: [null],
      AccountGroupID: [null],
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

  enableDate(): void {
    if (this.balanceSheetForms.get("IsDateRange").value) {
      this.dateCheckbox = false;
      this.balanceSheetForms.get("ToDate").enable();
      this.balanceSheetForms.get("FromDate").enable();
    } else {
      this.dateCheckbox = true;
      this.balanceSheetForms.get("ToDate").disable();
      this.balanceSheetForms.get("FromDate").disable();
    }
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.balanceSheetForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.balanceSheetForms.get("AccClassID").setValue([id]);
    }
  }

  opengroupPLBalance(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openLedgerDetails(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openBalanceSheetSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  changeProject(): void {
    const projectID = this.balanceSheetForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  openBalanceDrillDown(event, data): void {
    if (data.Type === "GROUP") {
      this.modalRef.hide();
      this.balanceSheetForms.get("Type").setValue(data.Type);
      this.balanceSheetForms.get("ID").setValue(data.ID);
      this.opengroupPLBalance(this.groupBalance);
      this.groupLoading = true;
      this.reportService
        .getBSGroupDetails(this.balanceSheetForms.value)
        .subscribe(
          (response) => {
            this.groupBalanceList = response.Entity.Entity;
            this.companyInfo = response.Entity.Company;
            this.totalGroupClosingBalance = response.Entity.ClosingBalance;
          },
          (error) => {
            this.groupLoading = false;
          },
          () => {
            this.groupLoading = false;
          }
        );
    }
    if (data.Type === "LEDGER") {
      this.modalRef.hide();
      this.balanceSheetForms.get("Type").setValue(data.Type);
      this.balanceSheetForms.get("ID").setValue(data.ID);
      this.openLedgerDetails(this.ledgerDetails);
      this.ledgerLoading = true;

      this.reportService
        .getBSLedgerDetails(this.balanceSheetForms.value)
        .subscribe(
          (response) => {
            this.ledgerDetailsList = response.Entity.Entity;
          },
          (error) => {
            this.ledgerLoading = false;
          },
          () => {
            this.ledgerLoading = false;
          }
        );
    }
  }

  openLedgerDetailsDetails(event, data): void {
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
