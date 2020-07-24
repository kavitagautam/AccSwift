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

  changeAccount(event, ledgerId): void {
    this.cashPaymentService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const cashPaymentFormArray = <FormArray>(
      this.cashPaymentForm.get("CashPaymentDetailsList")
    );

    const ledgerCode = cashPaymentFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      cashPaymentFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          cashPaymentFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
        (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
          this.addCashPaymentEntryList()
        );
      });
    }
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
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
          .get("LedgerID")
          .setValue(data.LedgerID);
        cashPaymentFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
      }
      (<FormArray>this.cashPaymentForm.get("CashPaymentDetailsList")).push(
        this.addCashPaymentEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
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
