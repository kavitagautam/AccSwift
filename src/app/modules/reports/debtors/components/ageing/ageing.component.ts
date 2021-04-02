import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { DebtorsAgeingList } from '@accSwift-modules/reports/models/debtors-ageing.model';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-ageing',
  templateUrl: './ageing.component.html',
  styleUrls: ['./ageing.component.scss']
})
export class AgeingComponent implements OnInit {
  ageingForm: FormGroup;
  modalRef: BsModalRef;
  debtorsAgeingList: DebtorsAgeingList[] = [];
  listLoading: boolean;

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

  ngAfterViewInit(): void {
    setTimeout(() => this.openDebtorsAgeingReportSettings(), 100);
  }

  buildAgeingForm(): void {
    this.ageingForm = this._fb.group({
      IsAgeing: [true],
      IsBillwiseAgeing: [false],
      IsShowVoucherBalance: [false],
      FirstPeriod: [0],
      SecondPeriod: [0, RxwebValidators.greaterThan({fieldName: 'FirstPeriod'})],
      ThirdPeriod: [0, RxwebValidators.greaterThan({fieldName: 'SecondPeriod'})],
      FourthPeriod: [0, RxwebValidators.greaterThan({fieldName: 'ThirdPeriod'} )],
      IsShowAllDebtors: [false],
      DebtorsID: [{value: 0, disabled: true}],
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}],
      IsDateRange: [false],
      ProjectID: [this.preferenceService.preferences ? this.preferenceService.preferences.DEFAULT_PROJECT.Value: null],
      AccClassID: [""]
    })
  }

  openDebtorsAgeingReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.ageingForm },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    })

    this.modalRef.content.onSubmit.subscribe((data) => {
     if (this.ageingForm.invalid) return;
      if (data) {
  
      this.reportsService.getDebtorsAgeingList(JSON.stringify(data)).subscribe(
        (response) => {
          this.debtorsAgeingList = response.Entity.Entity;
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
        if (this.ageingForm.invalid) return;
        this.showDebtorsAgeingReport();
      });
    
  }

  showDebtorsAgeingReport(): void {
    this.listLoading = true;
    this.reportsService.getDebtorsAgeingList(this.ageingForm.value).subscribe(
      (response) => {
        this.debtorsAgeingList = response.Entity.Entity;
      },
      (error) => {
        this.listLoading = false;
        this.modalRef.hide();
      },
      () => {
        this.modalRef.hide();
        this.listLoading = false;
      }
    );
  }

}
