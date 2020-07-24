import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ReportsService } from "../services/reports.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SalesReportList, CashPartyGroup } from "../models/sales.report.model";
import { CashParty } from "@accSwift-modules/accswift-shared/models/cash-party.model";
import { Depot } from "@accSwift-modules/depot/models/depot.model";
import { SalesAccounts } from "@accSwift-modules/accswift-shared/models/sales-account.model";

@Component({
  selector: "accSwift-sales-report",
  templateUrl: "./sales-report.component.html",
  styleUrls: ["./sales-report.component.scss"],
})
export class SalesReportComponent implements OnInit, AfterViewInit {
  salesReportForms: FormGroup;
  salesReportList: SalesReportList[] = [];
  cashPartyList: CashParty[] = [];
  cashPartyGroupList: CashPartyGroup[] = [];
  depotList: Depot[] = [];
  salesAccountList: SalesAccounts[] = [];
  selectType: string;
  @ViewChild("salesReportSettings") salesReportSettings;

  isActive;
  isActiveParty;
  selectReportWise;
  listLoading: boolean;
  toDateSelect: number;
  totalReturnQty: number;
  totalSalesQty: number;
  totalNetSalesQty: number;
  totalAmount: number;
  totalVATAmount: number;
  totalNetAmount: number;
  totalDiscountAmount: number;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-md",
  };
  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildSalesReportForms();
    this.getSalesAccount();
    this.getDepot();
    this.selectType = "product";
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => this.openSalesReportSettings(this.salesReportSettings),
      100
    );
  }

  buildSalesReportForms(): void {
    this.salesReportForms = this._fb.group({
      SalesLedgerID: [null],
      ProjectID: [null],
      DepotID: [null],
      AccClassID: [""],
      IsProductWise: [false],
      ProductGroupID: [null],
      ProductID: [null],
      PartyID: [null],
      PartyGroupID: [null],
      IsDateRange: [false],
      FromDate: [""],
      ToDate: [""],
      SalesReportType: [""],
    });
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.salesReportForms.get("ToDate").setValue(lastDayOfMonth);
  }

  getCashParty(): void {
    this.reportService.getCashParty().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
  }

  getSalesAccount(): void {
    this.reportService.getSalesAccount().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
  }

  getCashPartyGroup(): void {
    this.reportService.getCashPartyGroup().subscribe((response) => {
      this.cashPartyGroupList = response.Entity;
    });
  }

  getDepot(): void {
    this.reportService.getDepotList().subscribe((response) => {
      this.depotList = response.Entity;
    });
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.salesReportForms.get("AccClassID").setValue([id]);
    }
  }

  openSalesReportSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  allProduct(event): void {
    this.salesReportForms.get("ProductID").setValue(null);
    this.salesReportForms.get("ProductGroupID").setValue(null);
    this.salesReportForms.get("ProductID").disable();
    this.salesReportForms.get("ProductGroupID").disable();
  }

  singleProduct(event): void {
    this.salesReportForms.get("ProductGroupID").setValue(null);
    this.salesReportForms.get("ProductGroupID").disable();
  }

  productGroup(event): void {
    this.salesReportForms.get("ProductID").setValue(null);
    this.salesReportForms.get("ProductID").disable();
    this.salesReportForms.get("ProductGroupID").enable();
  }

  reportType(type): void {
    this.selectType = type;
    if (this.selectType === "party") {
      this.getCashParty();
      this.getCashPartyGroup();
    }
  }

  allCashPArty(): void {
    this.salesReportForms.get("PartyID").setValue(null);
    this.salesReportForms.get("PartyGroupID").setValue(null);
    this.salesReportForms.get("PartyID").disable();
    this.salesReportForms.get("PartyGroupID").disable();
  }

  singleCashParty(): void {
    this.salesReportForms.get("PartyGroupID").setValue(null);
    this.salesReportForms.get("PartyGroupID").disable();
  }

  cashPartyGroup(): void {
    this.salesReportForms.get("PartyID").setValue(null);
    this.salesReportForms.get("PartyID").disable();
    this.salesReportForms.get("PartyGroupID").enable();
  }

  showReport(): void {
    this.listLoading = true;
    this.reportService.getSalesReports(this.salesReportForms.value).subscribe(
      (response) => {
        this.salesReportList = response.Entity.Entity;
        this.totalAmount = response.Entity.TotalAmount;
        this.totalDiscountAmount = response.Entity.TotalDiscountAmount;
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
}
