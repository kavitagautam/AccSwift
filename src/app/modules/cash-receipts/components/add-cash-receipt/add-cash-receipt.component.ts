import { Component, OnInit } from "@angular/core";
import { CashReceiptMaster } from "../../models/cash-receipt.model";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "app-add-cash-receipt",
  templateUrl: "./add-cash-receipt.component.html",
  styleUrls: ["./add-cash-receipt.component.scss"]
})
export class AddCashReceiptComponent implements OnInit {
  private editedRowIndex: number;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();

  cashRecieptDetail: CashReceiptMaster;
  addCashReceiptForm: FormGroup;
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
    public cashReceiptService: CashReceiptService
  ) {}

  ngOnInit() {
    this.buildCashReceiptForm();
    this.cashReceiptService.init();
  }

  buildCashReceiptForm(): void {
    this.addCashReceiptForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      cashAccount: [""],
      date: [],
      cashReceiptEntryList: this._fb.array([
        this.addCashReceiptEntryFormGroup()
      ])
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.addCashReceiptForm.get("cashReceiptEntryList");
  }

  addCashReceiptEntryFormGroup(): FormGroup {
    return this._fb.group({
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  onCheckChange(event) {
    // const formArray: FormArray = this.myForm.get('myChoices') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      //   formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      // formArray.controls.forEach((ctrl: FormControl) => {
      //   if(ctrl.value == event.target.value) {
      //     // Remove the unselected element from the arrayForm
      //     formArray.removeAt(i);
      //     return;
      //   }

      i++;
    }
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.addCashReceiptForm.get("cashReceiptEntryList").invalid) return;

    (<FormArray>this.addCashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.addCashReceiptForm.valid) {
      this.router.navigate(["/cash"]);
    } else {
    }
  }

  public cancel(): void {
    this.addCashReceiptForm.reset();
    this.router.navigate(["/cash"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addCashReceiptForm.get("cashReceiptEntryList").invalid) return;
    (<FormArray>this.addCashReceiptForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashRecieptEntry = <FormArray>(
      this.addCashReceiptForm.get("cashReceiptEntryList")
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
      this.addCashReceiptForm.get("cashReceiptEntryList")
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
          this.addCashReceiptForm.get("cashReceiptEntryList")
        );
        cashReceiptFormArray.controls[index]
          .get("balance")
          .setValue(data.ActualBalance);
        cashReceiptFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
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
      this.addCashReceiptForm.get("cashReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.addCashReceiptForm.get("cashReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
