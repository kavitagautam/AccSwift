import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DayBookService } from "../../services/day-book.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "accSwift-day-book",
  templateUrl: "./day-book.component.html",
  styleUrls: ["./day-book.component.scss"],
})
export class DayBookComponent implements OnInit, AfterViewInit {
  dayBookList: any[] = [];
  projectName: string;

  listLoading: boolean;
  dayBookSettingsForms: FormGroup;
  debitTotal: number;
  creditTotal: number;
  baseURL: string;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private dayBookService: DayBookService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private reportService: ReportsService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
    this.buildDayBookSettings();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openDayBookSettings(), 100);
  }

  buildDayBookSettings(): void {
    this.dayBookSettingsForms = this._fb.group({
      ProjectID: [null],
      AccClassID: [],
      IsDateRange: [false],
      IsTransactionWise: [false],
      FromDate: [{ value: "", disabled: true }],
      ToDate: [{ value: new Date(), disabled: true }],
      VoucherType: [null],
    });
  }

  openDayBookSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.dayBookSettingsForms },
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
        this.dayBookService.getDayBookData(JSON.stringify(data)).subscribe(
          (response) => {
            this.dayBookList = response.Entity.Entity;
            this.debitTotal = response.Entity.DebitTotal;
            this.creditTotal = response.Entity.CreditTotal;
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

  showReport(): void {
    this.listLoading = true;
    this.dayBookService
      .getDayBookData(this.dayBookSettingsForms.value)
      .subscribe(
        (response) => {
          this.dayBookList = response.Entity.Entity;
          this.debitTotal = response.Entity.DebitTotal;
          this.creditTotal = response.Entity.CreditTotal;
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

  cancel(): void {
    this.showReport();
  }
}
