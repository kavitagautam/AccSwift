import { BankPaymentList } from "./../../models/bank-payment.model";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BankPaymentService } from "../../services/bank-payment.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-edit-bank-payment",
  templateUrl: "../common-html/common-bank-payment.html",
  styleUrls: ["./edit-bank-payment.component.scss"],
})
export class EditBankPaymentComponent implements OnInit {
  bankPaymentForm: FormGroup;
  private editedRowIndex: number;
  currentAmount: string = "0.00";
  numericFormat: string = "n2";
  public decimals: number = 2;
  bankPaymentDetails: BankPaymentList;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  constructor(
    public bankPaymentService: BankPaymentService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildbankPaymentForm();
    this.getIdFromRoute();
  }

  buildbankPaymentForm(): void {
    this.bankPaymentForm = this._fb.group({
      ID: this.bankPaymentDetails ? this.bankPaymentDetails.ID : 0,
      SeriesID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.SeriesID : null,
      ],
      ProjectID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.ProjectID : null,
      ],
      VoucherNo: [
        this.bankPaymentDetails ? this.bankPaymentDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.bankPaymentDetails
          ? new Date(this.bankPaymentDetails.CreatedDate)
          : "",
      ],
      Remarks: [this.bankPaymentDetails ? this.bankPaymentDetails.Remarks : ""],
      BankPaymentDetailsList: this._fb.array([this.addBankPaymentEntryList()]),
    });
  }

  addBankPaymentEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      ChequeNumber: [""],
      ChequeDate: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.bankPaymentService
          .getBankPaymentDetails(params.get("id"))
          .subscribe((response) => {
            this.bankPaymentDetails = response.Entity;
            this.buildbankPaymentForm();
            this.setBankPaymentList();
          });
      }
    });
  }

  setBankPaymentList(): void {
    this.bankPaymentForm.setControl(
      "BankPaymentDetailsList",
      this.setBankPaymentFormArray(
        this.bankPaymentDetails.BankPaymentDetailsList
      )
    );
  }

  setBankPaymentFormArray(bankPaymentDetails): FormArray {
    const bankPaymentFormArray = new FormArray([]);
    if (bankPaymentDetails && bankPaymentDetails.length > 0) {
      bankPaymentDetails.forEach((element) => {
        bankPaymentFormArray.push(
          this._fb.group({
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerID: [element.LedgerID],
            LedgerCode: [
              element.LedgerCode ? element.LedgerCode : "",
              null,
              this.ledgerCodeMatchValidators.ledgerCodeMatch(),
            ],
            LedgerName: [element.LedgerName, Validators.required],
            ChequeNumber: [element.ChequeNumber],
            ChequeDate: [new Date(element.ChequeDate)],
            LedgerBalance: [element.LedgerBalance],
            Amount: [element.Amount],
            Remarks: [element.Remarks],
          })
        );
        (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
          this.addBankPaymentEntryList()
        );
      });
    } else {
      bankPaymentFormArray.push(
        this._fb.group({
          ID: [""],
          MasterID: [""],
          LedgerID: [""],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          ChequeNumber: [""],
          ChequeDate: [""],
          LedgerBalance: [""],
          Amount: [""],
          Remarks: [""],
        })
      );
    }
    return bankPaymentFormArray;
  }

  get getBankPaymentEntryList(): FormArray {
    return <FormArray>this.bankPaymentForm.get("BankPaymentDetailsList");
  }

  editBankPaymentEntry(): void {
    this.submitted = true;
    if (this.bankPaymentForm.get("BankPaymentDetailsList").invalid) return;
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
      this.addBankPaymentEntryList()
    );
    this.submitted = false;
  }

  changeAccount(event, ledgerId): void {
    this.bankPaymentService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const bankPaymentFormArray = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );

    const ledgerCode = bankPaymentFormArray.controls[rowIndex].get("LedgerCode")
      .value;
    if (
      bankPaymentFormArray.controls[rowIndex].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          bankPaymentFormArray.controls[rowIndex]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
      (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
        this.addBankPaymentEntryList()
      );
    }
  }

  public save(): void {
    if (this.bankPaymentForm.invalid) return;
    this.bankPaymentService
      .updateBankPayment(this.bankPaymentForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-payment"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Payment edited successfully");
        }
      );
  }

  public cancel(): void {
    this.bankPaymentForm.reset();
    this.router.navigate(["/bank-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.bankPaymentForm.get("BankPaymentDetailsList").invalid) return;
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
      this.addBankPaymentEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankPaymentEntry = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
    bankPaymentEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.particularsOraccountingHead);

    bankPaymentEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.currentAmount);
    bankPaymentEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const bankPaymentFormArray = <FormArray>(
          this.bankPaymentForm.get("BankPaymentDetailsList")
        );
        bankPaymentFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        bankPaymentFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
        bankPaymentFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
      }
      (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
        this.addBankPaymentEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    //Save code
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    // Calculation on Debit Total and Credit Total on Rows Removed
    const bankPaymentEntry = <FormArray>(
      this.bankPaymentForm.get("BankPaymentDetailsList")
    );
    // Remove the Row
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).removeAt(
      rowIndex
    );
  }
}
