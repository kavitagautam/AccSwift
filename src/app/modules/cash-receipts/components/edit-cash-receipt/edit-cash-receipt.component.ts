import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { CashReceiptMaster } from "../../models/cash-receipt.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

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
  editCashReceipForm: FormGroup;
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildCashReceiptForm();
    this.cashReceiptService.init();
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        this.cashReceiptService
          .getCashRecipetDetails(params.get("id"))
          .subscribe(res => {
            this.cashRecieptDetail = res;
            this.buildCashReceiptForm();
            this.setCashReceiptList();
          });
      }
    });
  }

  buildCashReceiptForm(): void {
    this.editCashReceipForm = this._fb.group({
      series: [this.cashRecieptDetail ? this.cashRecieptDetail.SeriesID : ""],
      project: [this.cashRecieptDetail ? this.cashRecieptDetail.ProjectID : ""],
      voucherNo: [
        this.cashRecieptDetail ? this.cashRecieptDetail.VoucherNo : ""
      ],
      cashAccount: [""],
      date: [
        this.cashRecieptDetail ? this.cashRecieptDetail.CashReceiptDate : ""
      ],
      cashReceiptEntryList: this._fb.array([
        this.addCashReceiptEntryFormGroup()
      ])
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.editCashReceipForm.get("cashReceiptEntryList");
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

  setCashReceiptList(): void {
    this.editCashReceipForm.setControl(
      "cashReceiptEntryList",
      this.setCashReceiptFormArray(this.cashRecieptDetail)
    );
  }

  setCashReceiptFormArray(cashRecepitDetails): FormArray {
    const cashReceiptFormArray = new FormArray([]);
    if (cashRecepitDetails && cashRecepitDetails.length > 0) {
      cashRecepitDetails.forEach(element => {
        cashRecepitDetails.push(
          this._fb.group({
            particularsOraccountingHead: [
              element.LedgerName,
              Validators.required
            ],
            voucherNo: element.VoucherNo,
            amount: element.ActualBalance,
            currentBalance: element.TotalAmount,
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

  onCheckChange(event) {
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
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
    if (this.editCashReceipForm.get("cashReceiptEntryList").invalid) return;

    (<FormArray>this.editCashReceipForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.editCashReceipForm.valid) {
      this.router.navigate(["/cash"]);
    } else {
    }
  }

  public cancel(): void {
    this.editCashReceipForm.reset();
    this.router.navigate(["/cash"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editCashReceipForm.get("cashReceiptEntryList").invalid) return;
    (<FormArray>this.editCashReceipForm.get("cashReceiptEntryList")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashRecieptEntry = <FormArray>(
      this.editCashReceipForm.get("cashReceiptEntryList")
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
      this.editCashReceipForm.get("cashReceiptEntryList")
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
          this.editCashReceipForm.get("cashReceiptEntryList")
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
      this.editCashReceipForm.get("cashReceiptEntryList")
    );

    // Remove the Row
    (<FormArray>this.editCashReceipForm.get("cashReceiptEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
