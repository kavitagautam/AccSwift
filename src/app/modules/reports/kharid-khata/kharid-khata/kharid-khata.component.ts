import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AmountDetails } from '@accSwift-modules/reports/models/kharid-khata.model';

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
  amountDetails: AmountDetails[]=[];

  constructor(
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private reportService: ReportsService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    this.buildKharidKhataReportForms;
    this.baseURL =
    this.location["_platformStrategy"]._platformLocation["location"].origin +
    "/#/";
  }

  buildKharidKhataReportForms(): void {
    this.kharidKhataReportForms = this._fb.group({
      FromDate: [{value: null, disabled: true}],
      ToDate: [{value: null, disabled: true}]
    })
  }

  openKharidKhataReportSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.kharidKhataReportForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });

    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {

        this.reportService.getKharidKhataReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.amountDetails = response.Entity.Entity;
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
    
  });

}}
