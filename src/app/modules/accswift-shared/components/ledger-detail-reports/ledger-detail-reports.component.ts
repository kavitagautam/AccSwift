import { LedgerList } from "@accSwift-modules/reports/models/trail-balance.model";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-ledger-detail-reports",
  templateUrl: "./ledger-detail-reports.component.html",
  styleUrls: ["./ledger-detail-reports.component.scss"],
})
export class LedgerDetailReportsComponent implements OnInit {
  @Input() ledgerDetailsList: LedgerList[] = [];
  projectName: string;
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;

  baseURL: string;
  constructor(
    private router: Router,
    private location: Location,
    public modalRefLedger: BsModalRef,
    private reportService: ReportsService
  ) {}

  ngOnInit() {
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });
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

  public onCancel(): void {
    this.onClose.next(true);
    this.modalRefLedger.hide();
    this.modalRefLedger = null;
  }
}
