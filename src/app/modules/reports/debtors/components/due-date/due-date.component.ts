import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DebtorsDuedateList } from '@accSwift-modules/reports/models/debtors-duedate.model';
import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';

@Component({
  selector: 'accSwift-due-date',
  templateUrl: './due-date.component.html',
  styleUrls: ['./due-date.component.scss']
})
export class DueDateComponent implements OnInit {
  
  dueDateForm: FormGroup;
  modalRef: BsModalRef;
  modalRefDueDate: BsModalRef;
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
    this.buildDuedateForm();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this. openDebtorsDueDateReportSettings(), 100);
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

  openDebtorsDueDateReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.dueDateForm },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    })

    this.modalRef.content.onSubmit.subscribe((data) => {
     if (this.dueDateForm.invalid) return;
      if (data) {
  
      this.reportsService.getDebtorsDuedateList(JSON.stringify(data)).subscribe(
        (response) => {
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
    }
  });
  
      this.modalRef.content.onClose.subscribe((data) => {
        if (this.dueDateForm.invalid) return;
        this.showDebtorsDuedateReport();
      });
    
  }

  showDebtorsDuedateReport(): void {
    this.listLoading = true;
    this.reportsService.getDebtorsDuedateList(this.dueDateForm.value).subscribe(
      (response) => {
        this.debtorsDuedateList = response.Entity.Entity;
        this.totalAmount = response.Entity.TotalAmount;
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
