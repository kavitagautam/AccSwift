import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import {
  TrailBalance,
  GroupBalanceList,
  LedgerList,
} from "../../models/trail-balance.model";
import { ReportsService } from "../../services/reports.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Company } from "@accSwift-modules/company/models/company.model";
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
  companyInfo: Company;
  trailBalnceList: TrailBalance[] = [];
  groupBalanceList: GroupBalanceList[] = [];
  ledgerDetailsList: LedgerList[] = [];
  listLoading: boolean;
  groupLoading: boolean;
  ledgerLoading: boolean;
  trailBalanceForms: FormGroup;
  accountsSelect: number;
  totalGroupClosingBalance: string;

  projectName: string;

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
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(template, config);
  }

  openGroupBalance(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openLedgerDetails(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  allGroupRadio(): void {
    if (this.trailBalanceForms.get("IsAllGroups").value === true) {
      this.trailBalanceForms.get("IsAllGroups").setValue(false);
    } else {
      this.trailBalanceForms.get("IsAllGroups").setValue(true);
    }
  }

  changeProject(): void {
    const projectID = this.trailBalanceForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  primaryGroupRadio(): void {
    if (this.trailBalanceForms.get("IsOnlyPrimaryGroups").value === true) {
      this.trailBalanceForms.get("IsOnlyPrimaryGroups").setValue(false);
    } else {
      this.trailBalanceForms.get("IsOnlyPrimaryGroups").setValue(true);
    }
  }

  ledgerOnlyRaido(): void {
    if (this.trailBalanceForms.get("IsLedgerOnly").value === true) {
      this.trailBalanceForms.get("IsLedgerOnly").setValue(false);
    } else {
      this.trailBalanceForms.get("IsLedgerOnly").setValue(true);
    }
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
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getTrailBalance(JSON.stringify(this.trailBalanceForms.value))
      .subscribe(
        (response) => {
          this.trailBalnceList = response.Entity.Entity;
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

  openTrailBalance(event, data): void {
    if (data.Type === "GROUP") {
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.openGroupBalance(this.groupBalance);
      this.groupLoading = true;
      this.reportService
        .getTrailGroupDetails(this.trailBalanceForms.value)
        .subscribe(
          (response) => {
            this.companyInfo = response.Entity.Company;
            this.groupBalanceList = response.Entity.Entity;
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
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.openLedgerDetails(this.ledgerDetails);
      this.ledgerLoading = true;

      this.reportService
        .getTrailLedgerDetails(this.trailBalanceForms.value)
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
}
