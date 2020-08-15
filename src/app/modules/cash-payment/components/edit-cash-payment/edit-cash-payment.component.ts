import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CashPaymentService } from "../../services/cash-payment.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { CashPayment } from "../../models/cash-payment.model";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-edit-cash-payment",
  templateUrl: "../common-html/common-cash-payment.html",
  styleUrls: ["./edit-cash-payment.component.scss"],
})
export class EditCashPaymentComponent implements OnInit {
  private editedRowIndex: number;
  cashPaymentForm: FormGroup;
  currentAmount: string = "0.00";

  cashPaymentDetail: CashPayment;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();

  // Open the Ledger List Modal on Popup....
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  constructor(
    public cashPaymentService: CashPaymentService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit(): void {
    this.buildCashPaymentForm(); // initialize the form
    this.getIdFromRoute();
  }

  buildCashPaymentForm(): void {
    this.cashPaymentForm = this._fb.group({
      ID: [this.cashPaymentDetail ? this.cashPaymentDetail.ID : 0],
      SeriesID: [
        this.cashPaymentDetail ? this.cashPaymentDetail.SeriesID : null,
      ],
      ProjectID: [
        this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : null,
      ],
      VoucherNo: [
        this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.cashPaymentDetail ? this.cashPaymentDetail.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.cashPaymentDetail ? new Date(this.cashPaymentDetail.Date) : "",
      ],
      CashPaymentDetailsList: this._fb.array([this.addCashPaymentEntryList()]),
    });
  }

  addCashPaymentEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerCode: [""],
      LedgerName: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.cashPaymentService
          .getCashPaymentDetails(params.get("id"))
          .subscribe((response) => {
            this.cashPaymentDetail = response.Entity;
            this.buildCashPaymentForm();
            this.setCashPaymentList();
          });
      }
    });
  }

  setCashPaymentList(): void {
    this.cashPaymentForm.setControl(
      "CashPaymentDetailsList",
      this.setCashPaymentFormArray(
        this.cashPaymentDetail.CashPaymentDetailsList
      )
    );
    (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
      this.addCashPaymentEntryList()
    );
  }

  setCashPaymentFormArray(cashPaymentDetails): FormArray {
    const cashPaymentFormArray = new FormArray([]);
    if (cashPaymentDetails && cashPaymentDetails.length > 0) {
      cashPaymentDetails.forEach((element) => {
        cashPaymentFormArray.push(
          this._fb.group({
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerID: [element.LedgerID],
            LedgerCode: [element.LedgerCode ? element.LedgerCode : ""],
            LedgerName: [element.LedgerName],
            LedgerBalance: element.LedgerBalance,
            Amount: element.Amount,
            Remarks: element.Remarks,
          })
        );
      });
    } else {
      cashPaymentFormArray.push(
        this._fb.group({
          ID: [0],
          MasterID: [0],
          LedgerID: [0],
          LedgerCode: [""],
          LedgerName: [""],
          LedgerBalance: [""],
          Amount: [""],
          Remarks: [""],
        })
      );
    }
    return cashPaymentFormArray;
  }

  get getCashPaymentEntryList(): FormArray {
    return <FormArray>this.cashPaymentForm.get("CashPaymentDetailsList");
  }

  public save(): void {
    if (this.cashPaymentForm.invalid) return;
    this.cashPaymentService
      .updateCashPayment(this.cashPaymentForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/cash-payment"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Cash payment edited successfully");
        }
      );
  }

  public cancel(): void {
    this.cashPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }
}
