import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "accSwift-settings-reports",
  templateUrl: "./settings-reports.component.html",
  styleUrls: ["./settings-reports.component.scss"],
})
export class SettingsReportsComponent implements OnInit {
  @Input("") settingsForms: FormGroup;
  toDateSelect: number;
  dateCheckbox: boolean = true;
  projectName: string;
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(private _fb: FormBuilder, public reportService: ReportsService) {}

  ngOnInit() {
    //this.settingsForms=
    // this.settingsForms = this._fb.group({
    //   Type: [""],
    //   ID: [null],
    //   IsLedgerOnly: [false],
    //   IsShowPreviousYear: [false],
    //   IsOpeningTrial: [false],
    //   GroupID: 0,
    //   IsShowSecondLevelGroupDtl: [false],
    //   IsAllGroups: [true],
    //   IsOnlyPrimaryGroups: [false],
    //   IsDateRange: [false],
    //   IsDetails: [false],
    //   IsShowZeroBalance: [false],
    //   ProjectID: [null],
    //   AccClassID: [],
    //   FromDate: [""],
    //   ToDate: [{ value: "", disabled: true }],
    // });
  }

  enableDate(): void {
    if (this.settingsForms.get("IsDateRange").value) {
      this.dateCheckbox = false;
      this.settingsForms.get("ToDate").enable();
    } else {
      this.dateCheckbox = true;
      this.settingsForms.get("ToDate").disable();
    }
  }

  allGroupRadio(): void {
    if (this.settingsForms.get("IsAllGroups").value === true) {
      this.settingsForms.get("IsAllGroups").setValue(false);
    } else {
      this.settingsForms.get("IsAllGroups").setValue(true);
    }
  }

  changeProject(): void {
    const projectID = this.settingsForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  primaryGroupRadio(): void {
    if (this.settingsForms.get("IsOnlyPrimaryGroups").value === true) {
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(false);
    } else {
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(true);
    }
  }

  ledgerOnlyRaido(): void {
    if (this.settingsForms.get("IsLedgerOnly").value === true) {
      this.settingsForms.get("IsLedgerOnly").setValue(false);
    } else {
      this.settingsForms.get("IsLedgerOnly").setValue(true);
    }
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.settingsForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.settingsForms.get("AccClassID").setValue([id]);
    }
  }

  today(): void {
    const today = new Date();
    this.settingsForms.get("ToDate").setValue(today);
  }
}
