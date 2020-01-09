import { BankReconciliationMaster, BankAccounts } from './../models/bank-reconciliation.model';
import { LedgerCodeMatchService } from "./../../../../shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "./../../../../shared/validators/async-validators/ledger-code-validators.service";
import { Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BankReconciliationService } from "./../../services/bank-reconciliation.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerModelPopupComponent } from '@app/shared/component/ledger-model-popup/ledger-model-popup.component';

@Component({
  selector: "app-edit-bank-reconciliation",
  templateUrl: "./edit-bank-reconciliation.component.html",
  styleUrls: ["./edit-bank-reconciliation.component.scss"]
})
export class EditBankReconciliationComponent implements OnInit {
  editReconciliationForm: FormGroup;
  date: Date = new Date();
  reconciliationDetails: BankReconciliationMaster;
  numericFormat: string = "n2";
  public decimals: number = 2;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };

  constructor(
    private _fb: FormBuilder,
    public reconciliationService: BankReconciliationService,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildeditReconciliationForm();
    this.getIdFromRoute();
  }

  buildeditReconciliationForm() {
    this.editReconciliationForm = this._fb.group({
      seriesId: [this.reconciliationDetails ? this.reconciliationDetails.SeriesID : 0],
      projectId: [this.reconciliationDetails ? this.reconciliationDetails.ProjectID : 0],
      voucherNo: [this.reconciliationDetails ? this.reconciliationDetails.VoucherNo : ""],
      bankAccountId: [this.reconciliationDetails ? this.reconciliationDetails.LedgerID : 0],
      date: [this.reconciliationDetails ? new Date(this.reconciliationDetails.CreatedDate) : ""],
      reconciliationEntryList: this._fb.array([this.addReconciliationEntryList()])
    });
  }

  addReconciliationEntryList(): FormGroup {
    return this._fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOrAccountingHead: ["", Validators.required],
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
      const param = params.get("id");
      if (param) {
        this.reconciliationService.getBankReconciliationDetails(param).subscribe(res => {
          this.reconciliationDetails = res;
          this.buildeditReconciliationForm();
          this.setReconciliationList();
        })
      }
    })
  }

  setReconciliationList(): void {
    this.editReconciliationForm.setControl("reconciliationEntryList", this.setReconciliationFormArray(this.reconciliationDetails.BankReconciliationDetailsList))
  }

  get getreconciliationEntryList(): FormArray {
    return <FormArray>this.editReconciliationForm.get("reconciliationEntryList");
  }

  setReconciliationFormArray(reconciliationDetails): FormArray {
    const reconciliationFormArray = new FormArray([]);
    if (reconciliationDetails && reconciliationDetails.length > 0) {
      reconciliationDetails.forEach(element => {
        reconciliationFormArray.push(
          this._fb.group({
            ledgerCode: [element.Ledger.Code ? element.Ledger.Code : ""],
            particularsOrAccountingHead: [element.Ledger.EngName, Validators.required],
            voucherNo: [element.VoucherNumber],
            chequeNo: [element.ChequeNumber],
            chequeBank: [element.ChequeBank],
            chequeDate: [new Date(element.ChequeDate)],
            amount: [element.Amount],
            currentBalance: [element.Amount],
            vType: [element.VoucherType],
            remarks: [element.Remarks]
          })
        );
      });
    } else {
      reconciliationFormArray.push(
        this._fb.group({
          particularsOrAccountingHead: ["", Validators.required],
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
    return reconciliationFormArray;
  }

  addreconciliationEntry(): void {
    this.submitted = true;
    if (this.editReconciliationForm.get("reconciliationEntryList").invalid) return;

    (<FormArray>this.editReconciliationForm.get("reconciliationEntryList")).push(
      this.addReconciliationEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, selectedRow): void {
    const reconciliationFormArray = <FormArray>(
      this.editReconciliationForm.get("reconciliationEntryList")
    );
    const ledgerCode = reconciliationFormArray.controls[selectedRow].get("ledgerCode").value;
    if (reconciliationFormArray.controls[selectedRow].get("ledgerCode").status === "VALID") {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          reconciliationFormArray.controls[selectedRow]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          reconciliationFormArray.controls[selectedRow]
            .get("particularsOrAccountingHead")
            .setValue(selectedItem[0].LedgerName);
          reconciliationFormArray.controls[selectedRow]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }
  public save(): void {
    if (this.editReconciliationForm.valid) {
      this.router.navigate(["/bank-reconciliation"]);
    } else {
    }
  }

  public cancel(): void {
    this.editReconciliationForm.reset();
    this.router.navigate(["/bank-reconciliation"]);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editReconciliationForm.get("reconciliationEntryList").invalid) return;
    (<FormArray>this.editReconciliationForm.get("reconciliationEntryList")).push(
      this.addReconciliationEntryList());
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const reconciliationEntry = <FormArray>(
      this.editReconciliationForm.get("reconciliationEntryList")
    );
    reconciliationEntry.controls[rowIndex].get("particularsOrAccountingHead").setValue(dataItem.particularsOrAccountingHead);
    reconciliationEntry.controls[rowIndex].get("voucherNo").setValue(dataItem.voucherNo);
    reconciliationEntry.controls[rowIndex].get("currentAmount").setValue(dataItem.currentAmount);
    reconciliationEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    reconciliationEntry.controls[rowIndex].get("remarks").setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editReconciliationForm.get("reconciliationEntryList")
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
        const reconciliationFormArray = <FormArray>(
          this.editReconciliationForm.get("reconciliationEntryList")
        );
        reconciliationFormArray.controls[index].get("currentBalance").setValue(data.ActualBalance);
        reconciliationFormArray.controls[index].get("particularsOrAccountingHead").setValue(data.LedgerName);
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
    const bankReconciliationEntry = <FormArray>(this.editReconciliationForm.get("reconciliationEntryList")
    );
    // Remove the Row
    (<FormArray>bankReconciliationEntry).removeAt(rowIndex);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
