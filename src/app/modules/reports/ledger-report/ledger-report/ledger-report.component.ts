import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReportsService } from "../../services/reports.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { LedgerList } from "../../models/ledger.reports.model";

@Component({
  selector: "accSwift-ledger-report",
  templateUrl: "./ledger-report.component.html",
  styleUrls: ["./ledger-report.component.scss"],
})
export class LedgerReportComponent implements OnInit, AfterViewInit {
  @ViewChild("ledgerSettings") ledgerSettings;
  baseURL: string;
  ledgerReportForms: FormGroup;
  projectName: string;
  toDateSelect: number;
  ledgerReportList: LedgerList[];
  listLoading: boolean;
  accountLedger: boolean;
  accountGroup: boolean;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    public reportService: ReportsService,
    private modalService: BsModalService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.buildLedgerReportForms();
    this.baseURL =
      this.location["_platformStrategy"]._platformLocation["location"].origin +
      "/#/";
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openLedgerSettings(this.ledgerSettings), 100);
  }

  buildLedgerReportForms(): void {
    this.ledgerReportForms = this._fb.group({
      LedgerID: [null],
      AccountGroupID: [null],
      IsShowRemarks: [false],
      IsDateRange: [false],
      IsDetails: [false],
      IsShowZeroBalance: [false],
      ProjectID: [null],
      AccClassID: [],
      FromDate: [""],
      ToDate: [""],
    });
  }

  openLedgerSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  changeProject(): void {
    const projectID = this.ledgerReportForms.get("ProjectID").value;
    const filterValue = this.reportService.projectList.filter(
      (s) => s.ID == projectID
    );
    this.projectName = filterValue[0].EngName;
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.ledgerReportForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.ledgerReportForms.get("AccClassID").setValue([id]);
    }
  }

  today(): void {
    const today = new Date();
    this.ledgerReportForms.get("ToDate").setValue(today);
  }

  showReport(): void {
    this.modalRef.hide();
    this.listLoading = true;
    this.reportService
      .getLedgerReports(JSON.stringify(this.ledgerReportForms.value))
      .subscribe(
        (response) => {
          this.ledgerReportList = response.Entity.Entity;
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
