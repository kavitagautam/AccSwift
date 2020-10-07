import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";
import { LedgerMin } from "@accSwift-modules/ledger/models/ledger.models";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-settings-reports",
  templateUrl: "./settings-reports.component.html",
  styleUrls: ["./settings-reports.component.scss"],
})
export class SettingsReportsComponent implements OnInit {
  @Input() settingsForms: FormGroup;
  toDateSelect: number;
  dateCheckbox: boolean = true;
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;
  // public projectName: Subject<string>;
  formsField = [];

  accountLedger: boolean = false;
  accountsSelect: number;

  accountGroup: boolean = false;
  ledgerMinList: LedgerMin[] = [];
  ledgerGroupList: LedgerGroup[] = [];
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    public modalRef: BsModalRef
  ) {}

  ngOnInit() {
    this.formsField = [];
    this.onClose = new Subject();
    this.onSubmit = new Subject();
    //this.projectName = new Subject();
    this.getLedger();
    this.getLedgerGroup();
    for (const key in this.settingsForms.value) {
      this.formsField.push(key);
    }
    // console.log("Forms Filed " + JSON.stringify(this.formsField));
  }

  getLedger(): void {
    this.reportService.getLedgerMin().subscribe((response) => {
      this.ledgerMinList = response.Entity;
    });
  }

  getLedgerGroup(): void {
    this.reportService.getLedgerGroup().subscribe((response) => {
      this.ledgerGroupList = response.Entity;
    });
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

  accountLedgerCheck(): void {
    this.accountGroup = false;
    if (this.accountLedger == true) {
      this.accountLedger = false;
      this.settingsForms.get("LedgerID").disable();
    } else {
      this.accountLedger = true;
    }
    this.settingsForms.get("LedgerID").enable();
  }

  accountGroupCheck(): void {
    this.accountLedger = false;
    if (this.accountGroup == true) {
      this.accountGroup = false;
      this.settingsForms.get("AccountGroupID").disable();
    } else {
      this.accountGroup = true;
    }
    this.settingsForms.get("AccountGroupID").enable();
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
    //this.projectName.next(filterValue[0].EngName);
    this.reportService.selectProject(filterValue[0].EngName);
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

  showReport(): void {
    this.onSubmit.next(this.settingsForms.value);
    this.onClose.next(true);
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(true);
    this.modalRef.hide();
    this.modalRef = null;
  }
}
