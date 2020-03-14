import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { BankReceiptMaster } from "../../models/bank-receipt.model";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "accswift-edit-bank-receipt",
  templateUrl: "./edit-bank-receipt.component.html",
  styleUrls: ["./edit-bank-receipt.component.scss"]
})
export class EditBankReceiptComponent implements OnInit {
  private editedRowIndex: number;
  bankReceiptDetails: BankReceiptMaster;
  editBankReceiptForm: FormGroup;
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
    class: "modal-lg"
  };
  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    public bankReceiptService: BankReceiptService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.buildBankReceiptForm();
    this.bankReceiptService.init();
    this.getIdFromRoute(); // Get Id From the Route URL and get the Details
  }

  buildBankReceiptForm(): void {
    this.editBankReceiptForm = this._fb.group({
      seriesId: [
        this.bankReceiptDetails ? this.bankReceiptDetails.SeriesID : null
      ],
      projectId: [
        this.bankReceiptDetails ? this.bankReceiptDetails.ProjectID : null
      ],
      voucherNo: [
        this.bankReceiptDetails ? this.bankReceiptDetails.VoucherNo : "",
        [Validators.required]
      ],
      bankAccountId: [
        this.bankReceiptDetails ? this.bankReceiptDetails.LedgerID : null,
        [Validators.required]
      ],
      cashParty: [""],
      date: [
        this.bankReceiptDetails
          ? new Date(this.bankReceiptDetails.CreatedDate)
          : ""
      ],
      bankReceiptEntryList: this._fb.array([this.addBankReceiptEntryList()])
    });
  }

  addBankReceiptEntryList(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      chequeNo: [""],
      chequeBank: [""],
      chequeDate: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.bankReceiptService
          .getBankReceiptDetails(params.get("id"))
          .subscribe(res => {
            this.bankReceiptDetails = res;
            this.buildBankReceiptForm();
            this.setBankReceiptList();
          });
      }
    });
  }

  setBankReceiptList(): void {
    this.editBankReceiptForm.setControl(
      "bankReceiptEntryList",
      this.setBankReceiptFormArray(
        this.bankReceiptDetails.BankReceiptDetailsList
      )
    );
  }

  get getBankReceiptEntryList(): FormArray {
    return <FormArray>this.editBankReceiptForm.get("bankReceiptEntryList");
  }

  setBankReceiptFormArray(bankReceiptDetails): FormArray {
    const bankReceiptFormArray = new FormArray([]);
    if (bankReceiptDetails && bankReceiptDetails.length > 0) {
      bankReceiptDetails.forEach(element => {
        bankReceiptFormArray.push(
          this._fb.group({
            ledgerCode: [element.Ledger.Code ? element.Ledger.Code : ""],
            particularsOraccountingHead: [
              element.Ledger.EngName,
              Validators.required
            ],
            voucherNo: element.VoucherNumber,
            chequeNo: element.ChequeNumber,
            chequeBank: element.ChequeBank,
            chequeDate: new Date(element.ChequeDate),
            amount: element.Amount,
            currentBalance: element.Amount,
            vType: element.VoucherType,
            remarks: element.Remarks
          })
        );
      });
    } else {
      bankReceiptFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          chequeNo: [""],
          chequeBank: [""],
          chequeDate: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""]
        })
      );
    }
    return bankReceiptFormArray;
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.editBankReceiptForm.get("bankReceiptEntryList").invalid) return;

    (<FormArray>this.editBankReceiptForm.get("bankReceiptEntryList")).push(
      this.addBankReceiptEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const bankReceiptFormArray = <FormArray>(
      this.editBankReceiptForm.get("bankReceiptEntryList")
    );

    const ledgerCode = bankReceiptFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      bankReceiptFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          bankReceiptFormArray.controls[selectedRow]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          bankReceiptFormArray.controls[selectedRow]
            .get("particularsOraccountingHead")
            .setValue(selectedItem[0].LedgerName);
          bankReceiptFormArray.controls[selectedRow]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.editBankReceiptForm.valid) {
      this.router.navigate(["/cash-receipt"]);
    } else {
    }
  }

  public cancel(): void {
    this.editBankReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editBankReceiptForm.get("bankReceiptEntryList").invalid) return;
    (<FormArray>this.editBankReceiptForm.get("bankReceiptEntryList")).push(
      this.addBankReceiptEntryList()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const bankReceiptEntry = <FormArray>(
      this.editBankReceiptForm.get("bankReceiptEntryList")
    );
    bankReceiptEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    bankReceiptEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    bankReceiptEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    bankReceiptEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    bankReceiptEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editBankReceiptForm.get("bankReceiptEntryList")
    );
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const cashReceiptFormArray = <FormArray>(
          this.editBankReceiptForm.get("bankReceiptEntryList")
        );
        cashReceiptFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        cashReceiptFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
        cashReceiptFormArray.controls[index]
          .get("ledgerCode")
          .setValue(data.LedgerCode);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
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
      this.editBankReceiptForm.get("bankReceiptEntryList")
    );
    // Remove the Row
    (<FormArray>this.editBankReceiptForm.get("bankReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
