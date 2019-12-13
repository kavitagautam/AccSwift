import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { ContraVoucherService } from "./../../services/contra-voucher.service";
import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ContraVoucherMaster } from "../models/contravoucher.model";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "app-edit-contra-voucher",
  templateUrl: "./edit-contra-voucher.component.html",
  styleUrls: ["./edit-contra-voucher.component.scss"]
})
export class EditContraVoucherComponent implements OnInit {
  editContraVoucherForm: FormGroup;
  contraVoucherMaster: ContraVoucherMaster;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;

  constructor(
    private fb: FormBuilder,
    private contraVoucherService: ContraVoucherService,
    private route: ActivatedRoute,
    private router: Router,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    public ledgerCodeService: LedgerCodeMatchService
  ) { }

  ngOnInit() {
    this.getEditContraVoucherForm();
    this.contraVoucherService.init();
    this.getParambyId();
  }

  getEditContraVoucherForm() {
    this.editContraVoucherForm = this.fb.group({
      series: [
        this.contraVoucherMaster ? this.contraVoucherMaster.SeriesID : ""
      ],
      project: [
        this.contraVoucherMaster ? this.contraVoucherMaster.ProjectID : ""
      ],
      voucherNo: [
        this.contraVoucherMaster ? this.contraVoucherMaster.VoucherNo : ""
      ],
      cashAccount: [
        this.contraVoucherMaster ? this.contraVoucherMaster.LedgerID : ""
      ],
      cashParty: [this.contraVoucherMaster ? this.contraVoucherMaster : ""],
      date: [
        this.contraVoucherMaster
          ? formatDate(
            this.contraVoucherMaster.CreatedDate,
            "yyyy-MM-dd",
            "en-US"
          )
          : ""
      ],
      contraVoucherEntryList: this.fb.array([
        this.addContraVoucherEntryFormGroup()
      ])
    });
  }

  // Building FormArray ......
  addContraVoucherEntryFormGroup(): FormGroup {
    return this.fb.group({
      ledgerCode: [""],
      particularsOraccountingHead: [""],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  getParambyId() {
    this.route.paramMap.subscribe(params => {
      const paramGetId = params.get("id");
      if (paramGetId) {
        this.contraVoucherService
          .getCashReceiptDetails(paramGetId)
          .subscribe(res => {
            this.contraVoucherMaster = res;
            this.getEditContraVoucherForm();
            // this.setCashReceiptList();
          });
      }
    });
  }

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.editContraVoucherForm.get("contraVoucherEntryList");
  }

  // setCashReceiptList(): void {
  //   this.editContraVoucherForm.setControl(
  //     "contraVoucherEntryList",
  //     this.setContraVoucherFormArray(this.cashReceiptDetails.CashReceiptDetails)
  //   );

  setContraVoucherFormArray(contraVoucherDetails): FormArray {
    const contraVoucherFormArray = new FormArray([]);
    if (contraVoucherDetails && contraVoucherDetails.length > 0) {
      contraVoucherDetails.forEach(element => {
        contraVoucherFormArray.push(
          this.fb.group({
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
      contraVoucherFormArray.push(
        this.fb.group({
          particularsOraccountingHead: ["", Validators.required],
          voucherNo: [""],
          amount: [""],
          currentBalance: [""],
          vType: [""],
          remarks: [""]
        })
      );
    }
    return contraVoucherFormArray;
  }
  addContraVoucherEntry(): void {
    this.submitted = true;
    if (this.editContraVoucherForm.get("contraVoucherEntryList").invalid)
      return;

    (<FormArray>this.editContraVoucherForm.get("contraVoucherEntryList")).push(
      this.addContraVoucherEntryFormGroup()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const cashReceiptFormArray = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
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
    if (this.editContraVoucherForm.valid) {
      this.router.navigate(["/cash"]);
    } else {
    }
  }

  public cancel(): void {
    this.editContraVoucherForm.reset();
    this.router.navigate(["/cash"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editContraVoucherForm.get("contraVoucherEntryList").invalid)
      return;
    (<FormArray>this.editContraVoucherForm.get("contraVoucherEntryList")).push(
      this.addContraVoucherEntryFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const cashReceiptEntry = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
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
    sender.editRow(
      rowIndex,
      this.editContraVoucherForm.get("contraVoucherEntryList")
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
          this.editContraVoucherForm.get("contraVoucherEntryList")
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
    const cashReceiptEntry = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );

    // Remove the Row
    (<FormArray>this.editContraVoucherForm.get("contraVoucherEntryList")).removeAt(
      rowIndex
    );
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
