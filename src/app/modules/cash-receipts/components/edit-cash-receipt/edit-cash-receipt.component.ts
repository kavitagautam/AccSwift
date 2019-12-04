import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { CashReceiptMaster } from "../../models/cash-receipt.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";
import { LedgerCodeAsyncValidators } from "@app/shared/validators/async-validators/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-edit-cash-receipt",
  templateUrl: "./edit-cash-receipt.component.html",
  styleUrls: ["./edit-cash-receipt.component.scss"]
})
export class EditCashReceiptComponent implements OnInit {
  private editedRowIndex: number;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  cashRecieptDetail: CashReceiptMaster;
  editCashReceiptForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
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
    this.buildCashReceiptForm();
    this.cashReceiptService.init();
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.cashReceiptService
          .getCashReceiptDetails(params.get("id"))
          .subscribe(res => {
            this.cashRecieptDetail = res;
            this.buildCashReceiptForm();
            this.setCashReceiptList();
          });
      }
    });
  }

  buildCashReceiptForm(): void {
    this.editCashReceiptForm = this._fb.group({
      series: [this.cashRecieptDetail ? this.cashRecieptDetail.SeriesID : ""],
      project: [this.cashRecieptDetail ? this.cashRecieptDetail.ProjectID : ""],
      voucherNo: [
        this.cashRecieptDetail ? this.cashRecieptDetail.VoucherNo : ""
      ],
      cashAccount: [
        this.cashRecieptDetail ? this.cashRecieptDetail.LedgerID : ""
      ],
      cashParty: [""],
      date: [
        this.cashRecieptDetail
          ? formatDate(
              this.cashRecieptDetail.CreatedDate,
              "yyyy-MM-dd",
              "en-US"
            )
          : ""
      ],
      cashReceiptEntryList: this._fb.array([
        this.addCashReceiptEntryFormGroup()
      ])
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.editCashReceiptForm.get("cashReceiptEntryList");
  }

  addCashReceiptEntryFormGroup(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  setCashReceiptList(): void {
    this.editCashReceiptForm.setControl(
      "cashReceiptEntryList",
      this.setCashReceiptFormArray(this.cashRecieptDetail.CashReceiptDetails)
    );
  }

  setCashReceiptFormArray(cashRecepitDetails): FormArray {
    const cashReceiptFormArray = new FormArray([]);
    if (cashRecepitDetails && cashRecepitDetails.length > 0) {
      cashRecepitDetails.forEach(element => {
        cashReceiptFormArray.push(
          this._fb.group({
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
      cashReceiptFormArray.push(
        this._fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""]
        })
      );
    }
    return cashReceiptFormArray;
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.editCashReceiptForm.get("cashReceiptEntryList").invalid) return;

    (<FormArray>this.editCashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const cashReceiptFormArray = <FormArray>(
      this.editCashReceiptForm.get("cashReceiptEntryList")
    );

    const ledgerCode = cashReceiptFormArray.controls[selectedRow].get(
      "ledgerCode"
    ).value;
    if (
      cashReceiptFormArray.controls[selectedRow].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
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
      });
    }
  }

  public save(): void {
    if (this.editCashReceiptForm.valid) {
      this.router.navigate(["/cash"]);
    } else {
    }
  }

  public cancel(): void {
    this.editCashReceiptForm.reset();
    this.router.navigate(["/cash"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editCashReceiptForm.get("cashReceiptEntryList").invalid) return;
    (<FormArray>this.editCashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashRecieptEntry = <FormArray>(
      this.editCashReceiptForm.get("cashReceiptEntryList")
    );
    cashRecieptEntry.controls[rowIndex]
      .get("particularsOraccountingHead")
      .setValue(dataItem.particularsOraccountingHead);
    cashRecieptEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    cashRecieptEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    cashRecieptEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    cashRecieptEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editCashReceiptForm.get("cashReceiptEntryList")
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
          this.editCashReceiptForm.get("cashReceiptEntryList")
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
    const cashRecieptEntry = <FormArray>(
      this.editCashReceiptForm.get("cashReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.editCashReceiptForm.get("cashReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
