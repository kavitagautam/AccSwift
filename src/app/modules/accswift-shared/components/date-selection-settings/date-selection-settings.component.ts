import { ReportsService } from '@accSwift-modules/reports/services/reports.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'accSwift-date-selection-settings',
  templateUrl: './date-selection-settings.component.html',
  styleUrls: ['./date-selection-settings.component.scss']
})
export class DateSelectionSettingsComponent implements OnInit {
  @Input() dateSettingsForms: FormGroup;
  formsField = [];
  toDateSelect: number;
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;

  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.onSubmit = new Subject();
    this.formsField = [];
    this.formsField = Object.keys(this.dateSettingsForms.controls);
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.dateSettingsForms.get("ToDate").setValue(lastDayOfMonth);
  }

  today(): void {
    const today = new Date();
    this.dateSettingsForms.get("ToDate").setValue(today);
  }

  showReport(): void {
    this.onSubmit.next(this.dateSettingsForms.value);
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(true);
    this.modalRef.hide();
    this.modalRef = null;
  }

}
