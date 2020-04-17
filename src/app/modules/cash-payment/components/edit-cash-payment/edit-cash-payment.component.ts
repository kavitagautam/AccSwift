import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CashPaymentService } from "../../services/cash-payment.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { CashPaymentDetail } from "../../models/cash-payment.model";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accSwift-edit-cash-payment",
  templateUrl: "../common-html/common-cash-payment.html",
  styleUrls: ["./edit-cash-payment.component.scss"],
})
export class EditCashPaymentComponent implements OnInit {
  private editedRowIndex: number;
  cashPaymentForm: FormGroup;
  currentAmount: string = "0.00";

  cashPaymentDetail: CashPaymentDetail;
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
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit(): void {
    this.buildcashPaymentForm(); // initialize the form
    this.getIdFromRoute();
  }

  buildcashPaymentForm(): void {
    this.cashPaymentForm = this._fb.group({
      seriesId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.SeriesID : null,
      ],
      projectId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.ProjectID : null,
      ],
      voucherNo: [
        this.cashPaymentDetail ? this.cashPaymentDetail.VoucherNo : "",
        [Validators.required],
      ],
      cashAccountId: [
        this.cashPaymentDetail ? this.cashPaymentDetail.LedgerID : null,
        [Validators.required],
      ],
      cashPartyId: [null, [Validators.required]],
      date: [
        this.cashPaymentDetail
          ? new Date(this.cashPaymentDetail.CreatedDate)
          : "",
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
      LedgerName: ["", Validators.required],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = +params.get("id");
      if (param) {
        this.cashPaymentService
          .getCashPaymentDetails(param)
          .subscribe((response) => {
            this.cashPaymentDetail = response.Entity;
            this.buildcashPaymentForm;
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
            LedgerName: [element.LedgerName, Validators.required],
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
          LedgerName: ["", Validators.required],
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

  changeAccount(event, ledgerId): void {
    this.cashPaymentService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    this.modalRef.content = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const cashPaymentFormArray = <FormArray>(
          this.cashPaymentForm.get("CashPaymentDetailsList")
        );
        cashPaymentFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        cashPaymentFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        cashPaymentFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public save(): void {
    if (this.cashPaymentForm.valid) {
      this.router.navigate(["/cash-payment"]);
    } else {
    }
  }

  public cancel(): void {
    this.cashPaymentForm.reset();
    this.router.navigate(["/cash-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashPaymentForm.get("CashPaymentDetailsList").invalid) return;
    (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
      this.addCashPaymentEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashPaymentEntry = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.LedgerName);
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerCode")
      .setValue(dataItem.LedgerCode);
    cashPaymentEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.LedgerBalance);
    cashPaymentEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    // code goes here ......
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const cashPaymentEntry = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
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
