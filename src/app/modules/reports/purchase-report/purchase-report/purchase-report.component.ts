import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReportsService } from "../../services/reports.service";
import {
  DepotList,
  CashPartyGroup,
  CashParty,
  SalesAccount,
  PurchaseList,
} from "../../models/sales.report.model";

@Component({
  selector: "accSwift-purchase-report",
  templateUrl: "./purchase-report.component.html",
  styleUrls: ["./purchase-report.component.scss"],
})
export class PurchaseReportComponent implements OnInit {
  purchaseReportForms: FormGroup;
  purchaseReportList: PurchaseList[] = [];
  cashPartyList: CashParty[] = [];
  cashPartyGroupList: CashPartyGroup[] = [];
  depotList: DepotList[] = [];
  salesAccountList: SalesAccount[] = [];
  selectType: string;
  @ViewChild("purchaseReportSettings") purchaseReportSettings;

  isActive;
  isActiveParty;
  selectReportWise;
  listLoading: boolean;
  toDateSelect: number;
  totalReturnQty: number;
  totalSalesQty: number;
  totalNetSalesQty: number;
  totalPurchaseQty: number;
  totalVATAmount: number;
  totalNetAmount: number;
  totalDiscountAmount: number;
  totalAmount:number;
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
    this.buildpurchaseReportForms();
    this.getSalesAccount();
    this.getDepot();
    this.selectType = "product";
  }

  ngAfterViewInit(): void {
    setTimeout(
      () => this.openPurchaseReportSettings(this.purchaseReportSettings),
      100
    );
  }

  buildpurchaseReportForms(): void {
    this.purchaseReportForms = this._fb.group({
      PurchaseLedgerID: [null],
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
    this.purchaseReportForms.get("ToDate").setValue(lastDayOfMonth);
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
      this.purchaseReportForms.get("AccClassID").setValue([id]);
    }
  }

  openPurchaseReportSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  allProduct(event): void {
    this.purchaseReportForms.get("ProductID").setValue(null);
    this.purchaseReportForms.get("ProductGroupID").setValue(null);
    this.purchaseReportForms.get("ProductID").disable();
    this.purchaseReportForms.get("ProductGroupID").disable();
  }

  singleProduct(event): void {
    this.purchaseReportForms.get("ProductGroupID").setValue(null);
    this.purchaseReportForms.get("ProductGroupID").disable();
  }

  productGroup(event): void {
    this.purchaseReportForms.get("ProductID").setValue(null);
    this.purchaseReportForms.get("ProductID").disable();
    this.purchaseReportForms.get("ProductGroupID").enable();
  }

  reportType(type): void {
    this.selectType = type;
    if (this.selectType === "party") {
      this.getCashParty();
      this.getCashPartyGroup();
    }
  }

  allCashPArty(): void {
    this.purchaseReportForms.get("PartyID").setValue(null);
    this.purchaseReportForms.get("PartyGroupID").setValue(null);
    this.purchaseReportForms.get("PartyID").disable();
    this.purchaseReportForms.get("PartyGroupID").disable();
  }

  singleCashParty(): void {
    this.purchaseReportForms.get("PartyGroupID").setValue(null);
    this.purchaseReportForms.get("PartyGroupID").disable();
  }

  cashPartyGroup(): void {
    this.purchaseReportForms.get("PartyID").setValue(null);
    this.purchaseReportForms.get("PartyID").disable();
    this.purchaseReportForms.get("PartyGroupID").enable();
  }

  showReport(): void {
    this.listLoading = true;
    this.reportService
      .getPurchaseReports(this.purchaseReportForms.value)
      .subscribe(
        (response) => {
          this.purchaseReportList = response.Entity.Entity;
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
