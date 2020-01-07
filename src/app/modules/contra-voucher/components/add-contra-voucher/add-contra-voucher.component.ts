import { Component, OnInit } from "@angular/core";
import { FormArray, Validators, FormGroup, FormBuilder } from "@angular/forms";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";
import { formatDate } from "@angular/common";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { ContraVoucherService } from "../../services/contra-voucher.service";
import { ContraVoucherMaster } from "../models/contravoucher.model";

@Component({
  selector: "app-add-contra-voucher",
  templateUrl: "./add-contra-voucher.component.html",
  styleUrls: ["./add-contra-voucher.component.scss"]
})
export class AddContraVoucherComponent implements OnInit {
  addContraVoucherForm: FormGroup;

  date: Date = new Date();
  contraVoucherDetail: ContraVoucherMaster;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  //Open the Ledger List modal on popup
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };

  constructor(
    private fb: FormBuilder,
    public contraVoucherService: ContraVoucherService,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeService: LedgerCodeMatchService
  ) { }

  ngOnInit() {
    this.buildAddContraVoucherForm(); // initiate the AddContraVoucher Form
  }

  buildAddContraVoucherForm() {
    this.addContraVoucherForm = this.fb.group({
      seriesId: [0],
      projectId: [0],
      cashAccountId: [0],
      voucherNo: [""],
      cashPartyId: [0],
      date: [new Date()],
      contraVoucherEntryList: this.fb.array([
        this.addContraVoucherEntryFormGroup()
      ])
    });
  }

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

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.addContraVoucherForm.get("contraVoucherEntryList");
  }

  addContraVoucherEntry(): void {
    this.submitted = true;
    if (this.addContraVoucherForm.get("contraVoucherEntryList").invalid) return;
    (<FormArray>this.addContraVoucherForm.get("contraVoucherEntryList")).push(
      this.addContraVoucherEntryFormGroup()
    );
    this.submitted = false;
  }
  changeLedgerValue(dataItem, rowIndex): void {
    const contraVoucherFormArray = <FormArray>(
      this.addContraVoucherForm.get("contraVoucherEntryList")
    );
    const ledgerCode = contraVoucherFormArray.controls[rowIndex].get(
      "ledgerCode"
    ).value;
    if (
      contraVoucherFormArray.controls[rowIndex].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          contraVoucherFormArray.controls[rowIndex]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          contraVoucherFormArray.controls[rowIndex]
            .get("particularsOraccountingHead")
            .setValue(selectedItem[0].LedgerName);
          contraVoucherFormArray.controls[rowIndex]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.addContraVoucherForm.valid) {
      this.router.navigate(["/contra"]);
    } else {
    }
  }
  public cancel(): void {
    this.addContraVoucherForm.reset();
    this.router.navigate(["/contra"]);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.FormGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const contraVoucherEntry = <FormArray>(
      this.addContraVoucherForm.get("contraVoucherEntryList")
    );
    if (contraVoucherEntry.invalid) return;
    contraVoucherEntry.push(this.addContraVoucherEntryFormGroup());
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const contraVoucherEntry = <FormArray>(
      this.addContraVoucherForm.get("contraVoucherEntryList")
    );
    contraVoucherEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    contraVoucherEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    contraVoucherEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    contraVoucherEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.addContraVoucherForm.get("contraVoucherEntryList")
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
        const contraVoucherFormArray = <FormArray>(
          this.addContraVoucherForm.get("contraVoucherEntryList")
        );
        contraVoucherFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        contraVoucherFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
        contraVoucherFormArray.controls[index]
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
    const contraVoucherEntry = <FormArray>(
      this.addContraVoucherForm.get("contraVoucherEntryList")
    );
    contraVoucherEntry.removeAt(rowIndex);
  }
}
