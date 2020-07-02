import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ReportsService } from "../../services/reports.service";
import { Location } from "@angular/common";
import {
  ProfitLossLists,
  Company,
  LedgerDetailList,
  GroupDetailList,
} from "../../models/profit-loss.model";

@Component({
  selector: "accSwift-profit-loss",
  templateUrl: "./profit-loss.component.html",
  styleUrls: ["./profit-loss.component.scss"],
})
export class ProfitLossComponent implements OnInit, AfterViewInit {
  @ViewChild("profitLossSettings") profitLossSettings;
  @ViewChild("groupPLBalance") groupPLBalance;
  @ViewChild("ledgerPLDetails") ledgerPLDetails;
  baseURL: string;

  companyInfo: Company;

  listLoading: boolean;
  profitLossList: ProfitLossLists[] = [];
  groupBalanceList: GroupDetailList[] = [];
  ledgerDetailsList: LedgerDetailList[] = [];
  totalGroupClosingBalance: string;
  groupLoading: boolean;
  ledgerLoading: boolean;
  incomeList = [];
  toDateSelect: number;
  projectName: string;
  //Open the Ledger List Modal on PopUp
  profitLossForms: FormGroup;
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private reportService: ReportsService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.buildProfitLossForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.openProfitLossSettings(this.profitLossSettings), 100);
  }

  buildProfitLossForms(): void {
    this.profitLossForms = this._fb.group({
      Type: [""],
      ID: [null],
      DisplayFormat: ["TFormat"],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [],
      FromDate: [""],
      ToDate: [""],
    });
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.profitLossForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.profitLossForms.get("AccClassID").setValue([id]);
    }
  }

  openProfitLossSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  opengroupPLBalance(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openLedgerDetails(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  changeProject(): void {
    const projectID = this.profitLossForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  openPLDrillDown(event, data): void {
    console.log("dsadsa " + JSON.stringify(data));
    if (data.Type === "GROUP") {
      this.modalRef.hide();
      this.profitLossForms.get("Type").setValue(data.Type);
      this.profitLossForms.get("ID").setValue(data.ID);
      this.opengroupPLBalance(this.groupPLBalance);
      this.groupLoading = true;
      this.reportService
        .getPLGroupDetails(this.profitLossForms.value)
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
      this.profitLossForms.get("Type").setValue(data.Type);
      this.profitLossForms.get("ID").setValue(data.ID);
      this.openLedgerDetails(this.ledgerPLDetails);
      this.ledgerLoading = true;

      this.reportService
        .getPLLedgerDetails(this.profitLossForms.value)
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
      .getProfitLossReports(JSON.stringify(this.profitLossForms.value))
      .subscribe(
        (response) => {
          this.profitLossList = response.Entity.Entity;
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
