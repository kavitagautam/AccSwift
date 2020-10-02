import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import {
  TrailBalance,
  GroupBalanceList,
  LedgerList,
} from "../../models/trail-balance.model";
import { ReportsService } from "../../services/reports.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Company } from "@accSwift-modules/company/models/company.model";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { GroupBalanceReportComponent } from "@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";
@Component({
  selector: "accSwift-trial-balance",
  templateUrl: "./trial-balance.component.html",
  styleUrls: ["./trial-balance.component.scss"],
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {
  trailBalnceList: TrailBalance[] = [];

  listLoading: boolean;

  trailBalanceForms: FormGroup;

  projectName: string;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  public modalRefLedger: BsModalRef;
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
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildTrailBalanceForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openTrialBalanceSettings(), 100);
  }

  buildTrailBalanceForms(): void {
    this.trailBalanceForms = this._fb.group({
      Type: [""],
      ID: [null],
      IsLedgerOnly: [false],
      IsShowPreviousYear: [false],
      IsOpeningTrial: [false],
      GroupID: 0,
      IsShowSecondLevelGroupDtl: [false],
      IsAllGroups: [true],
      IsOnlyPrimaryGroups: [false],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [],
      FromDate: [""],
      ToDate: [""],
    });
  }

  openTrialBalanceSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.trailBalanceForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    // this.modalRef.content.projectName.subscribe((data) => {
    //   this.projectName = data;
    // });
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });
    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.listLoading = true;
        this.reportService.getTrailBalance(JSON.stringify(data)).subscribe(
          (response) => {
            this.trailBalnceList = response.Entity.Entity;
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
      this.showReport();
    });
  }

  showReport(): void {
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getTrailBalance(JSON.stringify(this.trailBalanceForms.value))
      .subscribe(
        (response) => {
          this.trailBalnceList = response.Entity.Entity;
        },
        (error) => {
          this.listLoading = false;
        },
        () => {
          this.listLoading = false;
        }
      );
  }

  cancel(): void {
    this.showReport();
  }

  openTrailBalance(event, data): void {
    if (data.Type === "GROUP") {
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.reportService
        .getTrailGroupDetails(this.trailBalanceForms.value)
        .subscribe((response) => {
          this.modalRef = this.modalService.show(GroupBalanceReportComponent, {
            initialState: {
              settingsForms: this.trailBalanceForms,
              companyInfo: response.Entity.Company,
              groupBalanceList: response.Entity.Entity,
              totalGroupClosingBalance: response.Entity.ClosingBalance,
            },
            ignoreBackdropClick: true,
            animated: true,
            keyboard: true,
            class: "modal-lg",
          });
        });
    }
    if (data.Type === "LEDGER") {
      this.trailBalanceForms.get("Type").setValue(data.Type);
      this.trailBalanceForms.get("ID").setValue(data.ID);
      this.reportService
        .getTrailLedgerDetails(this.trailBalanceForms.value)
        .subscribe((response) => {
          this.modalRefLedger = this.modalService.show(
            LedgerDetailReportsComponent,
            {
              initialState: {
                ledgerDetailsList: response.Entity.Entity,
              },
              ignoreBackdropClick: true,
              animated: true,
              keyboard: true,
              class: "modal-lg",
            }
          );
        });
    }
  }
}
