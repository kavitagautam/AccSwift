import { Company } from "@accSwift-modules/company/models/company.model";
import { GroupBalance } from "@accSwift-modules/reports/models/group-balance.model";
import { LedgerTransaction } from "@accSwift-modules/reports/models/ledger-transaction.model";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";
import { LedgerDetailReportsComponent } from "../ledger-detail-reports/ledger-detail-reports.component";

@Component({
  selector: "accSwift-group-balance-report",
  templateUrl: "./group-balance-report.component.html",
  styleUrls: ["./group-balance-report.component.scss"],
})
export class GroupBalanceReportComponent implements OnInit {
  @Input() settingsForms: FormGroup;

  @Input() companyInfo: Company;
  @Input() groupBalanceList: GroupBalance[] = [];
  @Input() totalGroupClosingBalance: string;
  ledgerDetailsList: LedgerTransaction[] = [];
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;
  constructor(
    public reportService: ReportsService,
    public modalRef: BsModalRef,
    public modalRefLedger: BsModalRef,

    private modalService: BsModalService
  ) {}

  ngOnInit() {}

  openTrailBalance(event, data): void {
    if (data.Type === "GROUP") {
      this.settingsForms.get("Type").setValue(data.Type);
      this.settingsForms.get("GroupID").setValue(data.ID);

      this.reportService
        .getGroupBalanceDetails(this.settingsForms.value)
        .subscribe((response) => {
          this.companyInfo = response.Entity.Company;
          this.groupBalanceList = response.Entity.Entity;
          this.totalGroupClosingBalance = response.Entity.ClosingBalance;
          this.modalRef = this.modalService.show(GroupBalanceReportComponent, {
            initialState: {
              settingsForms: this.settingsForms,
              companyInfo: this.companyInfo,
              groupBalanceList: this.groupBalanceList,
              totalGroupClosingBalance: this.totalGroupClosingBalance,
            },
            ignoreBackdropClick: true,
            animated: true,
            keyboard: true,
            class: "modal-lg",
          });
        });
    }
    if (data.Type === "LEDGER") {
      const obj = {
        LedgerID: data.ID,
        IsDetails: this.settingsForms.get("IsDetails").value,
        IsShowZeroBalance: this.settingsForms.get("IsShowZeroBalance").value,
        FromDate: this.settingsForms.get("FromDate").value,
        ToDate: this.settingsForms.get("ToDate").value,
        IsDateRange: this.settingsForms.get("IsDateRange").value,
        ProjectID: this.settingsForms.get("ProjectID").value,
        AccClassID: this.settingsForms.get("AccClassID").value,
      };
      this.reportService
        .getLedgerTransactionDetails(obj)
        .subscribe((response) => {
          this.ledgerDetailsList = response.Entity.Entity;
          this.modalRefLedger = this.modalService.show(
            LedgerDetailReportsComponent,
            {
              initialState: {
                ledgerDetailsList: this.ledgerDetailsList,
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

  public onCancel(): void {
    this.onClose.next(true);
    this.modalRef.hide();
  }
}
