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
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";

@Component({
  selector: "accSwift-sales-report",
  templateUrl: "./sales-report.component.html",
  styleUrls: ["./sales-report.component.scss"],
})
export class SalesReportComponent implements OnInit, AfterViewInit {
  salesReportForms: FormGroup;
  salesReportList: SalesReportList[] = [];

  selectType: string;

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
  projectName: string;
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  
  modalRefDetails: BsModalRef;

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
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildSalesReportForms();
    this.selectType = "product";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openSalesReportSettings(), 100);
  }

  buildSalesReportForms(): void {
    this.salesReportForms = this._fb.group({
      SalesLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
      ],
      DepotID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
          : null,
      ],
      AccClassID: [""],
      IsProductWise: [false],
      VoucherType: [null],
      ProductGroupID: [{ value: null, disabled: true }],
      ProductID: [{ value: null, disabled: true }],
      PartyID: [{ value: null, disabled: true }],
      PartyGroupID: [{ value: null, disabled: true }],
      IsDateRange: [false],
      FromDate: [{ value: "", disabled: true }],
      ToDate: [{ value: new Date(), disabled: true }],
      SalesReportType: [""],
    });
  }

  openSalesReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.salesReportForms },
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
          this.reportService.getSalesReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.salesReportList = response.Entity.Entity;
            this.totalAmount = response.Entity.TotalAmount;
            this.totalDiscountAmount = response.Entity.TotalDiscountAmount;
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


  productDetails: SalesReportList[]=[]
  
  openProductDetails(template: TemplateRef<any>, data): void {
    const obj = {
      ProductID: data.ID,
      PartyID: data.ID,
      SalesLedgerID: this.salesReportForms.get("SalesLedgerID").value,
      ProjectID: this.salesReportForms.get("ProjectID").value,
      DepotID: this.salesReportForms.get("DepotID").value,
      AccClassID: this.salesReportForms.get("AccClassID").value,
      IsProductWise: this.salesReportForms.get("IsProductWise").value,
      VoucherType: this.salesReportForms.get("VoucherType").value,
      IsDateRange: this.salesReportForms.get("IsDateRange").value,
      SalesReportType: this.salesReportForms.get("SalesReportType").value,
    };
    this.reportService.getSalesReports(obj).subscribe(
      (response) => {
        this.productDetails = response.Entity.Entity;
      }
    );
    const config = {
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    }
    this.modalRefDetails = this.modalService.show(template, config);
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
