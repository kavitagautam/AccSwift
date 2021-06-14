import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { DebtorsAgeingList } from '@accSwift-modules/reports/models/debtors-ageing.model';
import { DebtorsDuedateList } from '@accSwift-modules/reports/models/debtors-duedate.model';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
// import { RxwebValidators } from '@rxweb/reactive-form-validators';
// "@rxweb/reactive-form-validators": "^2.1.2", //in package.json
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-ageing',
  templateUrl: './ageing.component.html',
  styleUrls: ['./ageing.component.scss']
})
export class AgeingComponent implements OnInit {
  ageingForm: FormGroup;
  dueDateForm: FormGroup;
  modalRef: BsModalRef;
  modalRefDueDate: BsModalRef;
  debtorsAgeingList: DebtorsAgeingList[] = [];
  debtorsDuedateList: DebtorsDuedateList[] = [];
  totalAmount: number;
  baseURL: string;

  listLoading: boolean;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private location: Location,
    private reportsService: ReportsService,
    private preferenceService: PreferenceService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.buildAgeingForm();
    this.buildDuedateForm();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openDebtorsAgeingReportSettings(), 100);
  }

  buildAgeingForm(): void {
    this.ageingForm = this._fb.group({
      IsAgeing: [true],
      IsBillwiseAgeing: [false],
      IsShowVoucherBalance: [false],
      FirstPeriod: [15],
      SecondPeriod: [30],
      ThirdPeriod: [45],
      FourthPeriod: [60],
      // SecondPeriod: [30, RxwebValidators.greaterThan({fieldName: 'FirstPeriod'})],
      // ThirdPeriod: [45, RxwebValidators.greaterThan({fieldName: 'SecondPeriod'})],
      // FourthPeriod: [60, RxwebValidators.greaterThan({fieldName: 'ThirdPeriod'} )],
      IsShowAllDebtors: [false],
      DebtorsID: [0],
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}],
      IsDateRange: [false],
      ProjectID: [this.preferenceService.preferences ? this.preferenceService.preferences.DEFAULT_PROJECT.Value: null],
      AccClassID: [""]
    })
  }

  buildDuedateForm(): void {
    this.dueDateForm = this._fb.group({
      IsDueBills: [true],
      IsShowAllDebtors: [false],
      DebtorsID: [0],
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

  openDebtorsDuedateDetails(template: TemplateRef<any>, data): void {
    if (data) {
      this.reportsService.getDebtorsDuedateList(JSON.stringify(data)).subscribe((response) => {
        this.debtorsDuedateList = response.Entity.Entity;
        this.totalAmount = response.Entity.TotalAmount;
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
      );
      const config = {
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true,
        class: "modal-lg",
      }
      this.modalRefDueDate = this.modalService.show(template, config);
    }
  }

  openVoucherEdit(event, data): void {
    if (data.VoucherType === "BANK_PMNT")
    {
      window.open(this.baseURL + "bank-payment/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "BANK_RCPT")
    {
      window.open(this.baseURL + "bank-receipt/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "CASH_PMNT")
    {
      window.open(this.baseURL + "cash-payment/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "CASH_RCPT")
    {
      window.open(this.baseURL + "cash-receipt/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "JRNL")
    {
      window.open(this.baseURL + "journal/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "SALES")
    {
      window.open(this.baseURL + "sales-invoice/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "SLS_RTN")
    {
      window.open(this.baseURL + "sales-return/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "PURCH")
    {
      window.open(this.baseURL + "purchase-invoice/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "PURCH_ RTN")
    {
      window.open(this.baseURL + "purchase_return/edit/" + data.RowID, "_blank");
    }
    if (data.VoucherType === "CNTR")
    {
      window.open(this.baseURL + "contra-voucher/edit/" + data.RowID, "_blank");
    }
  }

}
