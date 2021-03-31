import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-ageing',
  templateUrl: './ageing.component.html',
  styleUrls: ['./ageing.component.scss']
})
export class AgeingComponent implements OnInit {
  ageingForm: FormGroup;
  modalRef: BsModalRef;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private reportsService: ReportsService,
    private preferenceService: PreferenceService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.buildAgeingForm();
  }

  buildAgeingForm(): void {
    this.ageingForm = this._fb.group({
      IsAgeing: [false],
      IsBillwiseAgeing: [false],
      IsShowVoucherBalance: [false],
      FirstPeriod: 0,
      SecondPeriod: 0,
      ThirdPeriod: 0,
      FourthPeriod: 0,
      IsShowAllDebtors: [false],
      DebtorsID: 0,
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}],
      IsDateRange: [false],
      ProjectID: [this.preferenceService.preferences ? this.preferenceService.preferences.DEFAULT_PROJECT.Value: null],
      AccClassID: [""]
    })
  }

  openDebtorsAgeingReportSettings(): void {
    console.log("Forms value " + JSON.stringify(this.ageingForm.value))
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.ageingForm },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    })
  }

}
