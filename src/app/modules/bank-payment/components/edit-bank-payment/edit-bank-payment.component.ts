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
  templateUrl: "./edit-bank-payment.component.html",
  styleUrls: ["./edit-bank-payment.component.scss"],
})
export class EditBankPaymentComponent implements OnInit {
  editBankPaymentForm: FormGroup;
  private editedRowIndex: number;
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
    private fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildEditBankPaymentForm();
    this.getIdFromRoute();
  }

  buildEditBankPaymentForm(): void {
    this.editBankPaymentForm = this.fb.group({
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
      bankPaymentEntryList: this.fb.array([this.addBankPaymentEntryList()]),
    });
  }

  addBankPaymentEntryList(): FormGroup {
    return this.fb.group({
      ID: [""],
      MasterID: [""],
      LedgerID: [""],
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
            console.log("dsda :" + JSON.stringify(response.Entity));
            this.buildEditBankPaymentForm();
            this.setBankPaymentList();
          });
      }
    });
  }

  setBankPaymentList(): void {
    this.editBankPaymentForm.setControl(
      "bankPaymentEntryList",
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
          this.fb.group({
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
            ChequeDate: [element.ChequeNumber],
            LedgerBalance: [element.LedgerBalance],
            Amount: [element.Amount],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      bankPaymentFormArray.push(
        this.fb.group({
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
    return <FormArray>this.editBankPaymentForm.get("bankPaymentEntryList");
  }

  editBankPaymentEntry(): void {
    this.submitted = true;
    if (this.editBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).push(
      this.addBankPaymentEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const bankPaymentFormArray = <FormArray>(
      this.editBankPaymentForm.get("bankPaymentEntryList")
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
    }
  }

  public save(): void {
    if (this.editBankPaymentForm.valid) {
      this.bankPaymentService
        .updateBankPayment(this.editBankPaymentForm.value)
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
  }

  public cancel(): void {
    this.editBankPaymentForm.reset();
    this.router.navigate(["/bank-payment"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editBankPaymentForm.get("bankPaymentEntryList").invalid) return;
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).push(
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
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
          this.editBankPaymentForm.get("bankPaymentEntryList")
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
      this.editBankPaymentForm.get("bankPaymentEntryList")
    );
    // Remove the Row
    (<FormArray>this.editBankPaymentForm.get("bankPaymentEntryList")).removeAt(
      rowIndex
    );
  }
}
