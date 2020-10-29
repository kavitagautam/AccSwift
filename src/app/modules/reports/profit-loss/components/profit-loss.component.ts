import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ReportsService } from "../../services/reports.service";
import { ProfitLossLists } from "../../models/profit-loss.model";
import { Company } from "@accSwift-modules/company/models/company.model";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { GroupBalanceReportComponent } from "@accSwift-modules/accswift-shared/components/group-balance-report/group-balance-report.component";
import { LedgerDetailReportsComponent } from "@accSwift-modules/accswift-shared/components/ledger-detail-reports/ledger-detail-reports.component";

@Component({
  selector: "accSwift-profit-loss",
  templateUrl: "./profit-loss.component.html",
  styleUrls: ["./profit-loss.component.scss"],
})
export class ProfitLossComponent implements OnInit, AfterViewInit {
  baseURL: string;
  companyInfo: Company;
  listLoading: boolean;
  profitLossList: ProfitLossLists[] = [];
  totalGroupClosingBalance: string;
  projectName: string;
  //Open the Ledger List Modal on PopUp
  profitLossForms: FormGroup;
  modalRef: BsModalRef;
  modalRefLedger: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private reportService: ReportsService,
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildProfitLossForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openProfitLossSettings(), 100);
  }

  buildProfitLossForms(): void {
    this.profitLossForms = this._fb.group({
      Type: [""],
      ID: [null],
      GroupID: [null],
      DisplayFormat: ["TFormat"],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [null],
      FromDate: [{ value: "", disabled: true }],
      ToDate: [{ value: new Date(), disabled: true }],
    });
  }

  openProfitLossSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.profitLossForms },
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
      class: "modal-lg",
    });
    this.reportService.projectName$.subscribe((value) => {
      this.projectName = value;
    });

    this.modalRef.content.onSubmit.subscribe((data) => {
      if (data) {
        this.listLoading = true;
        this.reportService.getProfitLossReports(JSON.stringify(data)).subscribe(
          (response) => {
            this.profitLossList = response.Entity.Entity;
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

  openPLDrillDown(event, data): void {
    if (data.Type === "GROUP") {
      this.modalRef.hide();
      this.profitLossForms.get("Type").setValue(data.Type);
      this.profitLossForms.get("GroupID").setValue(data.ID);
      this.reportService
        .getGroupBalanceDetails(this.profitLossForms.value)
        .subscribe((response) => {
          this.modalRef = this.modalService.show(GroupBalanceReportComponent, {
            initialState: {
              settingsForms: this.profitLossForms,
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
      this.modalRef.hide();
      const obj = {
        LedgerID: data.ID,
        IsDetails: this.profitLossForms.get("IsDetails").value,
        IsShowZeroBalance: this.profitLossForms.get("IsShowZeroBalance").value,
        FromDate: this.profitLossForms.get("FromDate").value,
        ToDate: this.profitLossForms.get("ToDate").value,
        IsDateRange: this.profitLossForms.get("IsDateRange").value,
        ProjectID: this.profitLossForms.get("ProjectID").value,
        AccClassID: this.profitLossForms.get("AccClassID").value,
      };
      this.reportService
        .getLedgerTransactionDetails(obj)
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

  showReport(): void {
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getProfitLossReports(JSON.stringify(this.profitLossForms.value))
      .subscribe(
        (response) => {
          this.profitLossList = response.Entity.Entity;
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
}
