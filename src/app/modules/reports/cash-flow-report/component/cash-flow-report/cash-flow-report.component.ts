import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AccountDetails } from '@accSwift-modules/reports/models/cash-flow.model';


@Component({
  selector: 'accSwift-cash-flow-report',
  templateUrl: './cash-flow-report.component.html',
  styleUrls: ['./cash-flow-report.component.scss']
})
export class CashFlowReportComponent implements OnInit {

  cashFlowReportForms: FormGroup;
  accountDetails: AccountDetails;
  modalRef: BsModalRef;
  baseURL: string;
  listLoading: boolean;

  constructor(
    private modalService: BsModalService,
    private reportService: ReportsService,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    this.buildCashFlowReportForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  buildCashFlowReportForms(): void {
    this.cashFlowReportForms = this._fb.group({
      IsGroupWise: [false],
      IsShowLedger: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}],
      IsDateRange: [false],
      ProjectID: [this.preferenceService.preferences ? this.preferenceService.preferences.DEFAULT_PROJECT.Value: null],
      AccClassID: [""]
    })
  }

  openCashFlowReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.cashFlowReportForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    this.modalRef.content.onClose.subscribe((data) => {
      this.showCashFlowReport();
    });
  }

  showCashFlowReport(): void {
    this.listLoading = true;
    this.reportService.getCashFlowReports(this.cashFlowReportForms.value).subscribe(
      (response) => {
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
}
