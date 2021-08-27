import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { MaterializedViewList } from '@accSwift-modules/reports/models/materialized-view.model';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Company } from '@accSwift-modules/company/models/company.model';
import { IconConst } from '@app/shared/constants/icon.constant';
import { SalesInvoiceService } from '@accSwift-modules/sales-invoice/services/sales-invoice.service';

@Component({
  selector: 'accSwift-materialized-view',
  templateUrl: './materialized-view.component.html',
  styleUrls: ['./materialized-view.component.scss']
})
export class MaterializedViewComponent implements OnInit {

  materializedViewForm: FormGroup;
  modalRef: BsModalRef;
  materializedViewList: MaterializedViewList[] = [];
  sumGrossAmount: number;
  sumDiscount: number;
  sumTaxAmount: number;
  sumTotalAmount: number;
  sumNetAmount: number;

  iconConst = IconConst;
  companyLogo: any = "";
  companyDetails: Company;
  
  listLoading: boolean;
  baseURL: string;

  constructor(
    private router: Router,
    private location: Location,
    private reportService: ReportsService,
    private preferenceService: PreferenceService,
    private salesInvoiceService: SalesInvoiceService,
    private modalService: BsModalService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildMaterializedViewForm();
    this.baseURL =
    this.location["_platformStrategy"]._platformLocation["location"].origin +
    "/#/";

    this.salesInvoiceService.getCompanyDetails().subscribe((response) => {
      this.companyDetails = response.Entity;
      if (this.companyDetails) {
        this.companyLogo = this.companyDetails.Logo;
      }
    }); 
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openMaterializedViewReportSettings(), 100);
  }

  buildMaterializedViewForm(): void {
    this.materializedViewForm = this._fb.group({
      FromDate: [{ value: "", disabled: false}],
      ToDate: [{ value: "", disabled: false}]
    })
  }

  openMaterializedViewReportSettings(): void {
    this.modalRef = this.modalService.show(DateSelectionSettingsComponent, {
      initialState: {dateSettingsForms: this.materializedViewForm },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-md",
    });

    this.modalRef.content.onSubmit.subscribe((data => {
      if (data)
      {
        this.reportService.getMaterializedViewReports(JSON.stringify(data)).subscribe((response) => {
          this.materializedViewList = response.Entity.Entity;
          this.sumGrossAmount = response.Entity.SumGrossAmount;
          this.sumDiscount = response.Entity.SumDiscount;
          this.sumTaxAmount = response.Entity.SumTaxAmount;
          this.sumTotalAmount = response.Entity.SumTotalAmount;
          this.sumNetAmount = response.Entity.SumNetAmount;
          localStorage.setItem("materializedViewList", JSON.stringify(response.Entity.Entity));
          localStorage.setItem("sumGrossAmount", JSON.stringify(response.Entity.SumGrossAmount));
          localStorage.setItem("sumDiscount", JSON.stringify(response.Entity.SumDiscount));
          localStorage.setItem("sumTaxAmount", JSON.stringify(response.Entity.SumTaxAmount));
          localStorage.setItem("sumTotalAmount", JSON.stringify(response.Entity.SumTotalAmount));
          localStorage.setItem("sumNetAmount", JSON.stringify(response.Entity.SumNetAmount));
        },
        (error) => {
          this.listLoading = false;
        },
        () => {
          this.listLoading = false;
        }
        )
      }
    }));

    this.modalRef.content.onClose.subscribe((data) => {
      this.showMaterializedViewReport();
    });

  };

  showMaterializedViewReport(): void {
    this.listLoading = true;
    this.reportService.getMaterializedViewReports(this.materializedViewForm.value).subscribe((response) => {
      this.materializedViewList = response.Entity.Entity;
      this.sumGrossAmount = response.Entity.SumGrossAmount;
      this.sumDiscount = response.Entity.SumDiscount;
      this.sumTaxAmount = response.Entity.SumTaxAmount;
      this.sumTotalAmount = response.Entity.SumTotalAmount;
      this.sumNetAmount = response.Entity.SumNetAmount;
    },
    (error) => {
      this.listLoading = false;
      this.modalRef.hide();
    },
    () => {
      this.modalRef.hide();
      this.listLoading = false;
    });
  }

}

