import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import {
  trailBalanceData,
  TrailBalance,
  GroupBalanceList,
  LedgerList,
} from "../../models/trail-balance.model";
import { ReportsService } from "../../services/reports.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
@Component({
  selector: "accSwift-trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["./trial-balance.component.scss"],
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {
  @ViewChild("trailBalanceSettings") trailBalanceSettings;
  @ViewChild("groupBalance") groupBalance;
  @ViewChild("ledgerDetails") ledgerDetails;
  baseURL: string;

  trailBalnceList: TrailBalance[] = [];
  groupBalanceList: GroupBalanceList[] = [];
  ledgerDetailsList: LedgerList[] = [];
  listLoading: boolean;
  trailBalanceForms: FormGroup;
  // previousYearPLDR: number;
  // previousYearPLCR: number;
  // openingDR: number;
  // openingCR: number;
  // trialTotalDR: number;
  // trialTotalCR: number;
  toDateSelect: number;

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
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.buildTrailBalanceForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => this.openTrialBalanceSettings(this.trailBalanceSettings),
      100
    );
  }

  buildTrailBalanceForms(): void {
    this.trailBalanceForms = this._fb.group({
      Type: [""],
      ID: [null],
      IsLedgerOnly: [false],
      IsShowPreviousYear: [false],
      IsOpeningTrial: [false],
      GroupID: 0,
      IsShowSecondLevelGroupDtl: [false],
      IsAllGroups: [true],
      IsOnlyPrimaryGroups: [false],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [],
      FromDate: [""],
      ToDate: [""],
    });
  }

  openTrialBalanceSettings(template: TemplateRef<any>): void {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-md",
    };
    this.modalRef = this.modalService.show(template, config);
  }

  openGroupBalance(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }
  openLedgerDetails(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.trailBalanceForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.trailBalanceForms.get("AccClassID").setValue([id]);
    }
  }

  today(): void {
    const today = new Date();
    this.trailBalanceForms.get("ToDate").setValue(today);
  }

  showReport(): void {
    this.listLoading = true;
    this.reportService
      .getTrailBalance(JSON.stringify(this.trailBalanceForms.value))
      .subscribe(
        (response) => {
          this.trailBalnceList = response.Entity;
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

  cancel(): void {
    this.showReport();
  }

  openTrailBalance(event, data): void {
    if (data.Type === "GROUP") {
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.openGroupBalance(this.groupBalance);
      this.reportService
        .getTrailGroupDetails(this.trailBalanceForms.value)
        .subscribe((response) => {
          this.groupBalanceList = response.Entity.Entity;
        });
    }
    if (data.Type === "LEDGER") {
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.openLedgerDetails(this.ledgerDetails);
      // const data1 = {
      //   Type: "LEDGER",
      //   ID: 191,
      //   IsLedgerOnly: true,
      //   IsShowPreviousYear: true,
      //   IsOpeningTrial: true,
      //   GroupID: 0,
      //   IsShowSecondLevelGroupDtl: true,
      //   IsAllGroups: true,
      //   IsOnlyPrimaryGroups: true,
      //   IsDateRange: true,
      //   IsDetails: true,
      //   IsShowZeroBalance: true,
      //   ProjectID: 0,
      //   AccClassID: [],
      //   FromDate: "2019-06-12T10:27:03.099Z",
      //   ToDate: "2020-06-12T10:27:03.099Z",
      // };
      this.reportService
        .getTrailLedgerDetails(this.trailBalanceForms.value)
        .subscribe((response) => {
          this.ledgerDetailsList = response.Entity.Entity;
        });
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
}
