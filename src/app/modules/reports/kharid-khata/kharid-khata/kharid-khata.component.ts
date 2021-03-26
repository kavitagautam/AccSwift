import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { KharidKhataList } from '@accSwift-modules/reports/models/kharid-khata.model';
import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';

@Component({
  selector: 'accSwift-kharid-khata',
  templateUrl: './kharid-khata.component.html',
  styleUrls: ['./kharid-khata.component.scss']
})
export class KharidKhataComponent implements OnInit {

  modalRef: BsModalRef;
  kharidKhataReportForms: FormGroup;
  baseURL: string;
  listLoading: boolean;
  kharidKhataList: KharidKhataList[] = [];
  sumTotalPurchaseAmt: number;
  sumNonTaxableAmt: number;
  sumTaxablePurchaseAmt: number;
  sumTaxPurchaseAmt: number;
  sumTaxableSalesAmt: number;
  sumTaxSalesAmt: number;

  constructor(
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private reportService: ReportsService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    this.buildKharidKhataReportForms();
    this.baseURL =
    this.location["_platformStrategy"]._platformLocation["location"].origin +
    "/#/";
  }

  buildKharidKhataReportForms(): void {
    this.kharidKhataReportForms = this._fb.group({
      FromDate: [{ value: "", disabled: false }],
      ToDate: [{ value: "", disabled: false }],
    })
  }

  openKharidKhataReportSettings(): void {
    this.modalRef = this.modalService.show(DateSelectionSettingsComponent, {
      initialState: { dateSettingsForms: this.kharidKhataReportForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-md",
    });

    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.reportService.getKharidKhataReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.kharidKhataList = response.Entity.Entity;
            this.sumTotalPurchaseAmt = response.Entity.SumTotalPurchaseAmt;
            this.sumNonTaxableAmt = response.Entity.SumNonTaxableAmt;
            this.sumTaxablePurchaseAmt = response.Entity.SumTaxablePurchaseAmt;
            this.sumTaxPurchaseAmt = response.Entity.SumTaxPurchaseAmt;
            this.sumTaxableSalesAmt = response.Entity.SumTaxableSalesAmt;
            this.sumTaxSalesAmt = response.Entity.SumTaxSalesAmt;
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
    this.showKharidKhataReport();
  });
  }

  showKharidKhataReport(): void{
    this.listLoading = true;
    this.reportService.getKharidKhataReports(this.kharidKhataReportForms.value).subscribe((response) => {
      this.kharidKhataList = response.Entity.Entity;
    },
    (error) => {
      this.listLoading = false;
      this.modalRef.hide();
    },
    () => {
      this.modalRef.hide();
    }
    );
  }


}
