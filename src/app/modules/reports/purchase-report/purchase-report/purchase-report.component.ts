import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ReportsService } from "../../services/reports.service";
import { PurchaseList } from "../../models/sales.report.model";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";

@Component({
  selector: "accSwift-purchase-report",
  templateUrl: "./purchase-report.component.html",
  styleUrls: ["./purchase-report.component.scss"],
})
export class PurchaseReportComponent implements OnInit {
  purchaseReportForms: FormGroup;
  purchaseReportList: PurchaseList[] = [];

  projectName: string;
  selectType: string;

  isActive;
  isActiveParty;
  selectReportWise;
  listLoading: boolean;
  totalReturnQty: number;
  totalSalesQty: number;
  totalNetSalesQty: number;
  totalPurchaseQty: number;
  totalVATAmount: number;
  totalNetAmount: number;
  totalDiscountAmount: number;
  totalAmount: number;
  baseURL: string;
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;

  modalRefDetails: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-md",
  };
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private location: Location,
    public reportService: ReportsService,
    private modalService: BsModalService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildpurchaseReportForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openPurchaseReportSettings(), 100);
  }

  buildpurchaseReportForms(): void {
    this.purchaseReportForms = this._fb.group({
      PurchaseLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PURCHASE_ACCOUNT.Value
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
      AccClassID: [null],
      IsProductWise: [false],
      VocherType: [null],
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

  openPurchaseReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.purchaseReportForms },
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
        if(data.IsProductWise == "true")
        {
          this.selectType = "product";
        }
        else 
        {
          this.selectType = "party";
        }

        this.reportService.getPurchaseReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.purchaseReportList = response.Entity.Entity;
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

  productDetails: PurchaseList[]=[]
  
  openProductDetails(template: TemplateRef<any>, data): void {
    
    let obj;
    if (this.selectType === "product")
    {
      obj = {
        ProductID: data.ID,
        PurchaseLedgerID: this.purchaseReportForms.get("PurchaseLedgerID").value,
        ProjectID: this.purchaseReportForms.get("ProjectID").value,
        DepotID: this.purchaseReportForms.get("DepotID").value,
        AccClassID: this.purchaseReportForms.get("AccClassID").value,
        IsProductWise: this.purchaseReportForms.get("IsProductWise").value,
        VocherType: this.purchaseReportForms.get("VocherType").value,
        IsDateRange: this.purchaseReportForms.get("IsDateRange").value,
        SalesReportType: this.purchaseReportForms.get("SalesReportType").value,
      };
    }
    else 
    {
      obj = {
        PartyID: data.ID,
        PurchaseLedgerID: this.purchaseReportForms.get("PurchaseLedgerID").value,
        ProjectID: this.purchaseReportForms.get("ProjectID").value,
        DepotID: this.purchaseReportForms.get("DepotID").value,
        AccClassID: this.purchaseReportForms.get("AccClassID").value,
        IsProductWise: this.purchaseReportForms.get("IsProductWise").value,
        VocherType: this.purchaseReportForms.get("VocherType").value,
        IsDateRange: this.purchaseReportForms.get("IsDateRange").value,
        SalesReportType: this.purchaseReportForms.get("SalesReportType").value,
      };
    }
    this.reportService.getPurchaseReports(obj).subscribe(
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

  openPurchaseDetailsDetails(event, data): void {
    if (data.VocherType === "PURCH") {
      window.open(this.baseURL + "purchase-invoice/edit/" + data.RowID, "_blank");
    }
    if (data.VocherType === "PURCH_RTN") {
      window.open(this.baseURL + "purchase-return/edit/" + data.RowID, "_blank");
    }
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
