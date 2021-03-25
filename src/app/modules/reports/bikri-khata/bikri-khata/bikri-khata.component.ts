import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { AmountDetails } from '@accSwift-modules/reports/models/bikri-khata.model';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-bikri-khata',
  templateUrl: './bikri-khata.component.html',
  styleUrls: ['./bikri-khata.component.scss']
})
export class BikriKhataComponent implements OnInit {
  modalRef: BsModalRef;
  bikriKhataReportForms: FormGroup;
  listLoading: boolean;
  amountDetails: AmountDetails[] = [];
  sumTotalSalesAmt: number;
  sumNonTaxableSalesAmt: number;
  sumExport: number;
  sumTaxableAmount: number;
  sumTaxAmount: number;

  constructor(
    private _fb: FormBuilder, 
    private router: Router, 
    private modalService: BsModalService, 
    private reportService: ReportsService, 
    private preferenceService: PreferenceService) { }

  ngOnInit() {
    this.buildBikriKhataReportForms();
  }

  buildBikriKhataReportForms(): void{
    this.bikriKhataReportForms = this._fb.group({
      FromDate: [{ value: "", disabled: false}],
      ToDate: [{ value: "", disabled: false}]
    })
  }

  openBikriKhataReportSettings(): void {
    this.modalRef = this.modalService.show(DateSelectionSettingsComponent,
      {
        initialState: {dateSettingsForms: this.bikriKhataReportForms},
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true,
        class: "modal-md"
      });

      this.modalRef.content.onSubmit.subscribe((data) => {
        if(data)
        {
          this.reportService.getBikriKhataReports(JSON.stringify(data)).subscribe(
            (response) => {
              this.amountDetails = response.Entity.Entity;
              this.sumTotalSalesAmt = response.Entity.SumTotalSalesAmt;
              this.sumNonTaxableSalesAmt = response.Entity.SumNonTaxableSalesAmt;
              this.sumExport = response.Entity.SumExport;
              this.sumTaxableAmount = response.Entity.SumTaxableAmount;
              this.sumTaxAmount = response.Entity.SumTaxAmount;
          },
          (error) => {
            this.listLoading = false;
          },
          () => {
            this.listLoading = false;
          }
          )
        }
      });

      this.modalRef.content.onClose.subscribe((data) => {
        this.showBikriKhataReports();
      })
  }

  showBikriKhataReports(): void {
    this.listLoading = true;
    this.reportService.getBikriKhataReports(this.bikriKhataReportForms.value).subscribe((response) => {
      this.amountDetails = response.Entity.Entity;
  },
  (error) => {
    this.listLoading = false;
    this.modalRef.hide();
  },
  () =>{
    this.modalRef.hide();
    }
    );
  }


}
