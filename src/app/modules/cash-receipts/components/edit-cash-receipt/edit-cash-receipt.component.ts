import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { CashReceiptMaster, LedgerList } from "../../models/cash-receipt.model";
import { SortDescriptor } from "@progress/kendo-data-query";
import { SelectAllCheckboxState, PageChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: "app-edit-cash-receipt",
  templateUrl: "./edit-cash-receipt.component.html",
  styleUrls: ["./edit-cash-receipt.component.scss"]
})
export class EditCashReceiptComponent implements OnInit {
  private editedRowIndex: number;
  @ViewChild("ledgerSelectModal") ledgerSelectModal: ElementRef;
  numericFormat: string = "n2";
  public decimals: number = 2;
  date: Date = new Date();
  cashRecieptDetail: CashReceiptMaster;
  editCashReceipForm: FormGroup;
  submitted: boolean;
  ledgerList: LedgerList[] = [];
  selectedLedgerRow: number;
  ledgerListLoading: boolean;

  rowSubmitted: boolean;

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "LedgerName" || "LedgerCode" || "ActualBalance" || "LedgerType",
      dir: "asc"
    }
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select
  constructor(
    public _fb: FormBuilder,
    private router: Router,
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

  
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getLedgerList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  openModal(index: number): void {
    this.mySelection = [];
    this.selectedLedgerRow = index;
    this.getLedgerList();
  }

  getLedgerList(): void {
    this.ledgerListLoading = true;
    this.cashReceiptService.getLedgerList().subscribe(
      res => {
        this.ledgerList = res;
      },
      error => {
        this.ledgerListLoading = false;
      },
      () => {
        this.ledgerListLoading = false;
      }
    );
  }

  // select ledger column
  selectedLedger(item, selectedRow): void {
    const cashReceiptEntry = <FormArray>(
      this.editCashReceipForm.get("cashReceiptEntryList")
    );
    cashReceiptEntry.controls[selectedRow]
      .get("currentBalance")
      .setValue(item.currentAmount);
    cashReceiptEntry.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(item.LedgerName);
    cashReceiptEntry.controls[selectedRow]
      .get("amount")
      .setValue(item.ActualBalance);
    this.ledgerSelectModal.nativeElement.click();
  }

  //Selected the Ledger row
  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.ledgerList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    const selected = this.ledgerList.filter(function(obj) {
      return obj.LedgerID == e[0];
    });

    const cashReceiptFormArray = <FormArray>(
      this.editCashReceipForm.get("cashReceiptEntryList")
    );
    cashReceiptFormArray.controls[selectedRow]
      .get("balance")
      .setValue(selected[0].ActualBalance);
    cashReceiptFormArray.controls[selectedRow]
      .get("particularsOraccountingHead")
      .setValue(selected[0].LedgerName);
    this.ledgerSelectModal.nativeElement.click();
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
