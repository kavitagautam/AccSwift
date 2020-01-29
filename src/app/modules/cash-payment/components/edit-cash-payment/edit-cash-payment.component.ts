import { LedgerCodeMatchService } from "./../../../../shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "./../../../../shared/validators/async-validators/ledger-code-validators.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";
import { CashPaymentMaster } from "../../models/cash-payment.model";
import { CashPaymentService } from "../../services/cash-payment.service";

@Component({
  selector: "accSwift-edit-cash-payment",
  templateUrl: "./edit-cash-payment.component.html",
  styleUrls: ["./edit-cash-payment.component.scss"]
})
export class EditCashPaymentComponent implements OnInit {
  private editedRowIndex: number;
  editCashPaymentForm: FormGroup;
  cashPaymentDetail: CashPaymentMaster;
  allCash;
  submitted: boolean;
  rowSubmitted: boolean;
  date: Date = new Date();

  // Open the Ledger List Modal on Popup....
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };

  constructor(
    public cashPaymentService: CashPaymentService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.allCash = this.cashPaymentService.getCashPayment();
    this.buildEditCashPaymentForm(); // initialize the form
    this.getIdFromRoute();
  }

  buildEditCashPaymentForm() {
    this.editCashPaymentForm = this.fb.group({
      seriesId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.SeriesID : null
      ],
      projectId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : null
      ],
      voucherNo: [
        this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : "",
        [Validators.required]
      ],
      cashAccountId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.LedgerID : null,
        [Validators.required]
      ],
      cashPartyId: [null, [Validators.required]],
      date: [
        this.cashPaymentDetail
          ? new Date(this.cashPaymentDetail.CreatedDate)
          : ""
      ],
      cashPaymentEntryList: this.fb.array([this.addCashPaymentEntryList()])
    });
  }

  addCashPaymentEntryList(): FormGroup {
    return this.fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: "",
      amount: "",
      currentBalance: "",
      vType: "",
      remarks: ""
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      const param = +params.get("id");
      if (param) {
        this.cashPaymentService.getCashPaymentDetails(param).subscribe(res => {
          this.cashPaymentDetail = res;
          this.buildEditCashPaymentForm;
          this.setCashPaymentList();
        });
      }
    });
  }

  setCashPaymentList(): void {
    this.editCashPaymentForm.setControl(
      "cashPaymentEntryList",
      this.setCashPaymentFormArray(
        this.cashPaymentDetail.CashPaymentDetailsList
      )
    );
  }

  setCashPaymentFormArray(cashPaymentDetails): FormArray {
    const cashPaymentFormArray = new FormArray([]);
    if (cashPaymentDetails && cashPaymentDetails.length > 0) {
      cashPaymentDetails.forEach(element => {
        cashPaymentFormArray.push(
          this.fb.group({
            ledgerCode: [element.Ledger.Code ? element.Ledger.Code : ""],
            particularsOraccountingHead: [
              element.Ledger.EngName,
              Validators.required
            ],
            voucherNo: element.VoucherNumber,
            amount: element.Amount,
            currentBalance: element.Amount,
            vType: element.VoucherType,
            remarks: element.Remarks
          })
        );
      });
    } else {
      cashPaymentFormArray.push(
        this.fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""]
        })
      );
    }
    return cashPaymentFormArray;
  }

  get getCashPaymentEntryList(): FormArray {
    return <FormArray>this.editCashPaymentForm.get("cashPaymentEntryList");
  }

  public save(): void {
    if (this.editCashPaymentForm.valid) {
      this.router.navigate(["/cash-payment"]);
    } else {
    }
  }

  public cancel(): void {
    this.editCashPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editCashPaymentForm.get("cashPaymentEntryList").invalid) return;
    (<FormArray>this.editCashPaymentForm.get("cashPaymentEntryList")).push(
      this.addCashPaymentEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashPaymentEntry = <FormArray>(
      this.editCashPaymentForm.get("cashPaymentEntryList")
    );
    cashPaymentEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    cashPaymentEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    cashPaymentEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    cashPaymentEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    cashPaymentEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editCashPaymentForm.get("cashPaymentEntryList")
    );
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    // code goes here ......
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const cashPaymentEntry = <FormArray>(
      this.editCashPaymentForm.get("cashPaymentEntryList")
    );
    cashPaymentEntry.removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.FormGroup = undefined;
  }
}
