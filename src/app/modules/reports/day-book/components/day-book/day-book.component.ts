import { Component, OnInit, AfterViewInit } from "@angular/core";
import { DayBookService } from "../../services/day-book.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { SettingsReportsComponent } from "@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component";
import { ReportsService } from "@accSwift-modules/reports/services/reports.service";
@Component({
  selector: "accSwift-day-book",
  templateUrl: "./day-book.component.html",
  styleUrls: ["./day-book.component.scss"],
})
export class DayBookComponent implements OnInit, AfterViewInit {
  dayBookList: any[] = [];
  projectName: string;

  listLoading: boolean;
  dayBookSettingsForms: FormGroup;
  debitTotal: number;
  creditTotal: number;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    private dayBookService: DayBookService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private reportService: ReportsService
  ) {}

  ngOnInit(): void {
    this.buildDayBookSettings();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openDayBookSettings(), 100);
  }

  buildDayBookSettings(): void {
    this.dayBookSettingsForms = this._fb.group({
      ProjectID: [null],
      AccClassID: [],
      IsDateRange: [false],
      IsTransactionWise: [false],
      FromDate: [{ value: "", disabled: true }],
      ToDate: [{ value: new Date(), disabled: true }],
      VoucherType: [null],
    });
  }

  openDayBookSettings(): void {
    this.modalRef = this.modalService.show(SettingsReportsComponent, {
      initialState: { settingsForms: this.dayBookSettingsForms },
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
        this.dayBookService.getDayBookData(JSON.stringify(data)).subscribe(
          (response) => {
            this.dayBookList = response.Entity.Entity;
            this.debitTotal = response.Entity.DebitTotal;
            this.creditTotal = response.Entity.CreditTotal;
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
    this.listLoading = true;
    this.dayBookService
      .getDayBookData(this.dayBookSettingsForms.value)
      .subscribe(
        (response) => {
          this.dayBookList = response.Entity.Entity;
          this.debitTotal = response.Entity.DebitTotal;
          this.creditTotal = response.Entity.CreditTotal;
        },
        (error) => {
          this.listLoading = false;
          this.modalRef.hide();
        },
        () => {
          this.listLoading = false;
          this.modalRef.hide();
        }
      );
  }

  cancel(): void {
    this.showReport();
  }
}
