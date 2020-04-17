import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@app/shared/components/ledger-modal-popup/ledger-modal-popup.component";
import { CashReceipt } from "../../models/cash-receipt.model";

@Component({
  selector: "accSwift-edit-cash-receipt",
  templateUrl: "../common-html/common-cash-receipt.html",
  styleUrls: ["./edit-cash-receipt.component.scss"],
})
export class EditCashReceiptComponent implements OnInit {
  private editedRowIndex: number;
  numericFormat: string = "n2";
  public decimals: number = 2;
  currentAmount: string = "0.00";
  cashReceiptDetails: CashReceipt;
  cashReceiptForm: FormGroup;
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
    public cashReceiptService: CashReceiptService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.buildCashReceiptForm(); // Initialize the form
    this.getIdFromRoute(); // Get Id From the Route URL and get the Details
  }

  buildCashReceiptForm(): void {
    this.cashReceiptForm = this._fb.group({
      seriesId: [
        this.cashReceiptDetails ? this.cashReceiptDetails.SeriesID : null,
      ],
      projectId: [
        this.cashReceiptDetails ? this.cashReceiptDetails.ProjectID : null,
      ],
      voucherNo: [
        this.cashReceiptDetails ? this.cashReceiptDetails.VoucherNo : "",
        [Validators.required],
      ],
      cashAccountId: [
        this.cashReceiptDetails ? this.cashReceiptDetails.LedgerID : null,
        [Validators.required],
      ],
      cashPartyId: [null, [Validators.required]],
      date: [
        this.cashReceiptDetails
          ? new Date(this.cashReceiptDetails.CreatedDate)
          : "",
      ],
      cashReceiptEntryList: this._fb.array([
        this.addCashReceiptEntryFormGroup(),
      ]),
    });
  }

  addCashReceiptEntryFormGroup(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.cashReceiptService
          .getCashReceiptDetails(params.get("id"))
          .subscribe((response) => {
            this.cashReceiptDetails = response.Entity;
            this.buildCashReceiptForm();
            this.setCashReceiptList();
          });
      }
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.cashReceiptForm.get("cashReceiptEntryList");
  }

  setCashReceiptList(): void {
    this.cashReceiptForm.setControl(
      "cashReceiptEntryList",
      this.setCashReceiptFormArray(this.cashReceiptDetails.CashReceiptDetails)
    );
  }

  setCashReceiptFormArray(cashRecepitDetails): FormArray {
    const cashReceiptFormArray = new FormArray([]);
    if (cashRecepitDetails && cashRecepitDetails.length > 0) {
      cashRecepitDetails.forEach((element) => {
        cashReceiptFormArray.push(
          this._fb.group({
            ledgerCode: [element.LedgerCode ? element.LedgerCode : ""],
            particularsOraccountingHead: [
              element.LedgerName,
              Validators.required,
            ],
            voucherNo: element.VoucherNumber,
            amount: element.Amount,
            currentBalance: element.Amount,
            vType: element.VoucherType,
            remarks: element.Remarks,
          })
        );
        (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).push(
          this.addCashReceiptEntryFormGroup()
        );
      });
    } else {
      cashReceiptFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""],
        })
      );
    }
    return cashReceiptFormArray;
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.cashReceiptForm.get("cashReceiptEntryList").invalid) return;

    (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  changeAccount(event, ledgerId): void {
    this.cashReceiptService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const cashReceiptFormArray = <FormArray>(
      this.cashReceiptForm.get("cashReceiptEntryList")
    );

    const ledgerCode = cashReceiptFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      cashReceiptFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          cashReceiptFormArray.controls[selectedRow]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          cashReceiptFormArray.controls[selectedRow]
            .get("particularsOraccountingHead")
            .setValue(selectedItem[0].LedgerName);
          cashReceiptFormArray.controls[selectedRow]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
        (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).push(
          this.addCashReceiptEntryFormGroup()
        );
      });
    }
  }

  public save(): void {
    if (this.cashReceiptForm.valid) {
      this.router.navigate(["/cash-receipt"]);
    } else {
    }
  }

  public cancel(): void {
    this.cashReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.cashReceiptForm.get("cashReceiptEntryList").invalid) return;
    (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashReceiptEntry = <FormArray>(
      this.cashReceiptForm.get("cashReceiptEntryList")
    );
    cashReceiptEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    cashReceiptEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    cashReceiptEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    cashReceiptEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    cashReceiptEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.cashReceiptForm.get("cashReceiptEntryList"));
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
          this.cashReceiptForm.get("cashReceiptEntryList")
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
      (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).push(
        this.addCashReceiptEntryFormGroup()
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
    const cashReceiptEntry = <FormArray>(
      this.cashReceiptForm.get("cashReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.cashReceiptForm.get("cashReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
