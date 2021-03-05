import { CashParty } from "@accSwift-modules/accswift-shared/models/cash-party.model";
import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";
import { LedgerMin } from "@accSwift-modules/ledger/models/ledger.models";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { ProductGroup } from "@accSwift-modules/product/models/product-group.models";
import { ProductMin } from "@accSwift-modules/product/models/product-min.model";
import { CashPartyGroup } from "@accSwift-modules/reports/models/sales.report.model";
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
  selectType: string;

  isActive;
  isActiveParty;
  selectReportWise;
  accountLedger: boolean = false;
  accountsSelect: number;

  accountGroup: boolean = false;
  ledgerMinList: LedgerMin[] = [];
  ledgerGroupList: LedgerGroup[] = [];
  productGroups: ProductGroup[] = [];
  productMin: ProductMin[] = [];
  cashPartyList: CashParty[] = [];
  cashPartyGroupList: CashPartyGroup[] = [];
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
    public modalRef: BsModalRef,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit() {
    this.formsField = [];
    this.onClose = new Subject();
    this.onSubmit = new Subject();
    //this.projectName = new Subject();
    this.getLedger();
    this.getLedgerGroup();
    this.getProductGroupDD();
    this.getProductDD();
    this.selectType = "product";

    this.settingsForms
      .get("ProjectID")
      .setValue(
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null
      );
    this.formsField = Object.keys(this.settingsForms.controls);
  }

  getProductGroupDD(): void {
    this.reportService.getProductGroupDD().subscribe((response) => {
      this.productGroups = response.Entity;
    });
  }

  getProductDD(): void {
    this.reportService.getProductMinDD().subscribe((response) => {
      this.productMin = response.Entity;
    });
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
      this.settingsForms.get("FromDate").enable();
    } else {
      this.dateCheckbox = true;
      this.settingsForms.get("ToDate").disable();
      this.settingsForms.get("FromDate").disable();
    }
  }

  accountLedgerCheck(): void {
    if (this.accountLedger == true) {
      this.accountLedger = false;
      this.accountGroup = false;

      this.settingsForms.get("LedgerID").disable();
    } else {
      this.accountLedger = true;
      this.accountGroup = false;
      this.settingsForms.get("LedgerID").enable();
      this.settingsForms.get("GroupID").disable();
    }
  }

  accountGroupCheck(): void {
    if (this.accountGroup == true) {
      this.accountGroup = false;
      this.accountLedger = false;
      this.settingsForms.get("GroupID").disable();
    } else {
      this.accountGroup = true;
      this.accountLedger = false;
      this.settingsForms.get("GroupID").enable();
      this.settingsForms.get("LedgerID").disable();
    }
  }

  transactionToggle(): void {
    if (this.settingsForms.get("IsTransactionWise").value === true) {
      this.settingsForms.get("IsTransactionWise").setValue(false);
    } else {
      this.settingsForms.get("IsTransactionWise").setValue(true);
    }
  }

  allGroupRadio(): void {
    if (this.settingsForms.get("IsAllGroups").value === true) {
      this.settingsForms.get("IsAllGroups").setValue(false);
    } else {
      this.settingsForms.get("IsAllGroups").setValue(true);
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(false);

      this.settingsForms.get("IsLedgerOnly").setValue(false);
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

  reportType(type): void {
    this.selectType = type;

    if (this.selectType === "party") {
      this.selectType="party";
      this.getCashParty();
      this.getCashPartyGroup();
    }else{
      this.selectType="product";
      this.getProductDD();
      this.getProductGroupDD();
    }
   
  }

  getCashParty(): void {
    this.reportService.getCashParty().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
  }

  getCashPartyGroup(): void {
    this.reportService.getCashPartyGroup().subscribe((response) => {
      this.cashPartyGroupList = response.Entity;
    });
  }

  allCashPArty(event): void {
    this.settingsForms.get("PartyID").setValue(null);
    this.settingsForms.get("PartyGroupID").setValue(null);
    this.settingsForms.get("PartyID").disable();
    this.settingsForms.get("PartyGroupID").disable();
  }

  singleCashParty(event): void {
    this.settingsForms.get("PartyGroupID").setValue(null);
    this.settingsForms.get("PartyGroupID").disable();
    this.settingsForms.get("PartyID").enable();
  }

  cashPartyGroup(event): void {
    this.settingsForms.get("PartyID").setValue(null);
    this.settingsForms.get("PartyID").disable();
    this.settingsForms.get("PartyGroupID").enable();
  }

  primaryGroupRadio(): void {
    if (this.settingsForms.get("IsOnlyPrimaryGroups").value === true) {
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(false);
    } else {
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(true);
      this.settingsForms.get("IsAllGroups").setValue(false);
      this.settingsForms.get("IsLedgerOnly").setValue(false);
    }
  }

  ledgerOnlyRaido(): void {
    if (this.settingsForms.get("IsLedgerOnly").value === true) {
      this.settingsForms.get("IsLedgerOnly").setValue(false);
    } else {
      this.settingsForms.get("IsLedgerOnly").setValue(true);
      this.settingsForms.get("IsAllGroups").setValue(false);
      this.settingsForms.get("IsOnlyPrimaryGroups").setValue(false);
    }
  }

  isShowZeroBalanceClick(): void {
    if (this.settingsForms.get("IsShowZeroBalance").value === true) {
      this.settingsForms.get("IsShowZeroBalance").setValue(false);
    } else {
      this.settingsForms.get("IsShowZeroBalance").setValue(true);
      this.settingsForms.get("IsShowPreviousYear").setValue(false);
      this.settingsForms.get("IsShowSecondLevelGroupDtl").setValue(false);
    }
  }

  isShowSubLedgerClick(): void {
    if (this.settingsForms.get("IsShowSubLedger").value === true) {
      this.settingsForms.get("IsShowSubLedger").setValue(false);
    } else {
      this.settingsForms.get("IsShowSubLedger").setValue(true);
    }
  }

  isShowPreviousYearClick(): void {
    if (this.settingsForms.get("IsShowPreviousYear").value === true) {
      this.settingsForms.get("IsShowPreviousYear").setValue(false);
    } else {
      this.settingsForms.get("IsShowPreviousYear").setValue(true);
      this.settingsForms.get("IsShowZeroBalance").setValue(false);
      this.settingsForms.get("IsShowSecondLevelGroupDtl").setValue(false);
    }
  }

  isShowSecondLevelGroupClick(): void {
    if (this.settingsForms.get("IsShowSecondLevelGroupDtl").value === true) {
      this.settingsForms.get("IsShowSecondLevelGroupDtl").setValue(false);
    } else {
      this.settingsForms.get("IsShowSecondLevelGroupDtl").setValue(true);
      this.settingsForms.get("IsShowZeroBalance").setValue(false);
      this.settingsForms.get("IsShowPreviousYear").setValue(false);
    }
  }

  allProduct(event): void {
    this.settingsForms.get("ProductID").setValue(null);
    this.settingsForms.get("ProductGroupID").setValue(null);
    this.settingsForms.get("ProductID").disable();
    this.settingsForms.get("ProductGroupID").disable();
  }

  quantityRange(): void {
    this.settingsForms.get("FromQtyRange").enable();
    this.settingsForms.get("IsFromRangeMin").enable();
    this.settingsForms.get("IsToRangeMax").enable();
    this.settingsForms.get("ToQtyRange").enable();
  }

  singleProduct(event): void {
    this.settingsForms.get("ProductGroupID").setValue(null);
    this.settingsForms.get("ProductGroupID").disable();
    this.settingsForms.get("ProductID").enable();
  }

  productGroup(event): void {
    this.settingsForms.get("ProductID").setValue(null);
    this.settingsForms.get("ProductID").disable();
    this.settingsForms.get("ProductGroupID").enable();
  }

  // Filterable Ledger Group
  ledgerGroupDDFilter(value): void {
    this.ledgerGroupList = this.reportService.ledgerGroupLists.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  // Filterable Cash Party Drop-down
  productGroupDDFilter(value): void {
    this.productGroups = this.reportService.productGroupList.filter(
      (s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  // Filterable Cash Party Drop-down
  productDDFilter(value): void {
    this.productMin = this.reportService.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  ledgerDDFilter(value): void {
    this.ledgerMinList = this.reportService.ledgerMinLists.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(true);
    this.modalRef.hide();
    this.modalRef = null;
  }
}
