import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { DayBookService } from "../../services/day-book.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  AccountClass,
  ProjectList,
  TransactionVoucher,
} from "../../models/day-book.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
@Component({
  selector: "accSwift-day-book",
  templateUrl: "./day-book.component.html",
  styleUrls: ["./day-book.component.scss"],
})
export class DayBookComponent implements OnInit, AfterViewInit {
  dayBookList: any[] = [];
  @ViewChild("dayBookSettings") dayBookSettings;

  accountLists: AccountClass[];
  projectList: ProjectList[];
  transVoucherType: TransactionVoucher[];
  listLoading: boolean;
  dayBookSettingsForms: FormGroup;
  debitTotal: number;
  creditTotal: number;
  toDateSelect: number;
  monthList = [
    {
      name: "January",
      short: "Jan",
      number: 1,
    },
    {
      name: "February",
      short: "Feb",
      number: 2,
    },
    {
      name: "March",
      short: "Mar",
      number: 3,
    },
    {
      name: "April",
      short: "Apr",
      number: 4,
    },
    {
      name: "May",
      short: "May",
      number: 5,
    },
    {
      name: "June",
      short: "Jun",
      number: 6,
    },
    {
      name: "July",
      short: "Jul",
      number: 7,
    },
    {
      name: "August",
      short: "Aug",
      number: 8,
    },
    {
      name: "September",
      short: "Sep",
      number: 9,
    },
    {
      name: "October",
      short: "Oct",
      number: 10,
    },
    {
      name: "November",
      short: "Nov",
      number: 11,
    },
    {
      name: "December",
      short: "Dec",
      number: 12,
    },
  ];

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-md",
  };
  constructor(
    private dayBookService: DayBookService,
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.buildDayBookSettings();
    this.getProject();
    this.getAccountClass();
    this.getTransVoucher();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.openDayBookSettings(this.dayBookSettings), 100);
  }

  buildDayBookSettings(): void {
    this.dayBookSettingsForms = this._fb.group({
      ProjectID: [null],
      AccClassID: [],
      IsTransactionWise: [false],
      FromDate: [""],
      ToDate: [""],
      VoucherType: [null],
    });
  }

  endOfMonth(): void {
    var today = new Date();
    var lastDayOfMonth = new Date(
      today.getFullYear(),
      this.toDateSelect + 1,
      0
    );
    this.dayBookSettingsForms.get("ToDate").setValue(lastDayOfMonth);
  }

  selectAccounts(id, event): void {
    if (event.target.checked) {
      this.dayBookSettingsForms.get("AccClassID").setValue([id]);
    }
  }

  openDayBookSettings(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  getProject(): void {
    this.dayBookService.getProjectLists().subscribe((response) => {
      this.projectList = response.Entity;
    });
  }

  getAccountClass(): void {
    this.dayBookService.getAccountClass().subscribe((response) => {
      this.accountLists = response.Entity;
    });
  }

  getTransVoucher(): void {
    this.dayBookService.getVoucherType().subscribe((response) => {
      this.transVoucherType = response.Entity;
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
