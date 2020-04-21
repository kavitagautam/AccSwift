import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { BankReceiptDetail } from "../../models/bank-receipt.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accswift-edit-bank-receipt",
  templateUrl: "../common-html/common-bank-receipt.html",
  styleUrls: ["./edit-bank-receipt.component.scss"],
})
export class EditBankReceiptComponent implements OnInit {
  private editedRowIndex: number;
  bankReceiptDetails: BankReceiptDetail;
  currentAmount: string = "0.00";
  bankReceiptForm: FormGroup;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();

  submitted: boolean;
  rowSubmitted: boolean;
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
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    public bankReceiptService: BankReceiptService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildBankReceiptForm();
    this.getIdFromRoute(); // Get Id From the Route URL and get the Details
  }

  buildBankReceiptForm(): void {
    this.bankReceiptForm = this._fb.group({
      ID: [this.bankReceiptDetails ? this.bankReceiptDetails.ID : null],
      SeriesID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.SeriesID : null,
      ],
      ProjectID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.ProjectID : null,
        [Validators.required],
      ],
      VoucherNo: [
        this.bankReceiptDetails ? this.bankReceiptDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.bankReceiptDetails
          ? new Date(this.bankReceiptDetails.CreatedDate)
          : "",
      ],
      BankReceiptDetailsList: this._fb.array([
        this.addBankReceiptDetailsList(),
      ]),
    });
  }

  addBankReceiptDetailsList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      VoucherNumber: [""],
      ChequeNumber: [""],
      ChequeBank: [""],
      ChequeDate: [""],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.bankReceiptService
          .getBankReceiptDetails(params.get("id"))
          .subscribe((response) => {
            this.bankReceiptDetails = response.Entity;
            this.buildBankReceiptForm();
            this.setBankReceiptList();
          });
      }
    });
  }

  setBankReceiptList(): void {
    this.bankReceiptForm.setControl(
      "BankReceiptDetailsList",
      this.setBankReceiptFormArray(
        this.bankReceiptDetails.BankReceiptDetailsList
      )
    );
  }

  get getBankReceiptEntryList(): FormArray {
    return <FormArray>this.bankReceiptForm.get("BankReceiptDetailsList");
  }

  setBankReceiptFormArray(bankReceiptDetails): FormArray {
    const bankReceiptFormArray = new FormArray([]);
    if (bankReceiptDetails && bankReceiptDetails.length > 0) {
      bankReceiptDetails.forEach((element) => {
        bankReceiptFormArray.push(
          this._fb.group({
            ID: [element.ID ? element.ID : 0],
            MasterID: [element.MasterID ? element.MasterID : 0],
            LedgerID: [element.LedgerID ? element.LedgerID : 0],
            LedgerCode: [
              element.LedgerCode ? element.LedgerCode : "",
              null,
              this.ledgerCodeMatchValidators.ledgerCodeMatch(),
            ],
            LedgerName: [
              element.LedgerName ? element.LedgerName : "",
              Validators.required,
            ],
            VoucherNumber: [element.VoucherNumber ? element.VoucherNumber : ""],
            ChequeNumber: [element.ChequeNumber ? element.ChequeNumber : ""],
            ChequeBank: [element.ChequeBank ? element.ChequeBank : ""],
            ChequeDate: [
              element.ChequeDate ? new Date(element.ChequeDate) : "",
            ],
            Amount: [element.Amount ? element.Amount : 0],
            LedgerBalance: [element.LedgerBalance ? element.LedgerBalance : ""],
            VoucherType: [element.VoucherType ? element.VoucherType : ""],
            Remarks: [element.Remarks ? element.Remarks : ""],
          })
        );
      });
    } else {
      bankReceiptFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          ID: [0],
          MasterID: [0],
          LedgerID: [0],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          VoucherNumber: [""],
          ChequeNumber: [""],
          ChequeBank: [""],
          ChequeDate: [""],
          Amount: [""],
          LedgerBalance: [""],
          VoucherType: [""],
          Remarks: [""],
        })
      );
    }
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptDetailsList()
    );
    return bankReceiptFormArray;
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.bankReceiptForm.get("BankReceiptDetailsList").invalid) return;

    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptDetailsList()
    );
    this.submitted = false;
  }

  changeAccount(event, ledgerId): void {
    this.bankReceiptService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const bankReceiptFormArray = <FormArray>(
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );

    const ledgerCode = bankReceiptFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      bankReceiptFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
          bankReceiptFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
        }
        (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
          this.addBankReceiptDetailsList()
        );
      });
    }
  }

  public save(): void {
    if (this.bankReceiptForm.invalid) return;
    this.bankReceiptService
      .updateBankReceipt(this.bankReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Receipt edited successfully");
        }
      );
  }

  public cancel(): void {
    this.bankReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.bankReceiptForm.get("BankReceiptDetailsList").invalid) return;
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptDetailsList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankReceiptEntry = <FormArray>(
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );
    bankReceiptEntry.controls[rowIndex]
      .get("LedgerName")
      .setValue(dataItem.LedgerName);
    bankReceiptEntry.controls[rowIndex]
      .get("VoucherNumber")
      .setValue(dataItem.VoucherNumber);
    bankReceiptEntry.controls[rowIndex]
      .get("LedgerBalance")
      .setValue(dataItem.LedgerBalance);
    bankReceiptEntry.controls[rowIndex]
      .get("VoucherType")
      .setValue(dataItem.VoucherType);
    bankReceiptEntry.controls[rowIndex]
      .get("Remarks")
      .setValue(dataItem.Remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.bankReceiptForm.get("BankReceiptDetailsList")
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
        const cashReceiptFormArray = <FormArray>(
          this.bankReceiptForm.get("BankReceiptDetailsList")
        );
        cashReceiptFormArray.controls[index]
          .get("LedgerBalance")
          .setValue(data.ActualBalance);
        cashReceiptFormArray.controls[index]
          .get("LedgerName")
          .setValue(data.LedgerName);
        cashReceiptFormArray.controls[index]
          .get("LedgerCode")
          .setValue(data.LedgerCode);
        cashReceiptFormArray.controls[index]
          .get("LedgerID")
          .setValue(data.LedgerID);
      }
      (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
        this.addBankReceiptDetailsList()
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
    const bankReceiptEntry = <FormArray>(
      this.bankReceiptForm.get("BankReceiptDetailsList")
    );
    // Remove the Row
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
