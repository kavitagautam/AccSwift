import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { LedgerDetails } from "../../models/ledger.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-account-ledger",
  templateUrl: "./account-ledger.component.html",
  styleUrls: ["./account-ledger.component.scss"]
})
export class AccountLedgerComponent implements OnInit, OnChanges {
  @ViewChild("openingBalanceModal") openingBalanceModal: ElementRef;
  @ViewChild("previousYearBalanceModal") previousYearBalanceModal: ElementRef;
  @Input("selectedItem") selectedItem;
  date: Date = new Date();
  selectedLedgerId: number;
  accoutLedgerForm: FormGroup;
  ledgerDetails: LedgerDetails;

  editMode: boolean;
  addMode: boolean;
  title: string;
  rowSubmitted: boolean;
  submitted: boolean;
  private editedRowIndex: number;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    public _fb: FormBuilder,
    public ledgerService: LedgerService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildAccountLedgerForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedLedgerId = this.selectedItem.ID;
    }

    if (this.selectedLedgerId) {
      this.getLedgerDetails();
    }
  }

  getLedgerDetails(): void {
    this.ledgerService
      .getLedgerDetails(this.selectedLedgerId)
      .subscribe(res => {
        this.ledgerDetails = res.Entity;
        this.buildAccountLedgerForm();
      });
  }

  buildAccountLedgerForm(): void {
    this.accoutLedgerForm = this._fb.group({
      ledgerCode: [
        this.ledgerDetails ? this.ledgerDetails.LedgerCode : "",
        Validators.required
      ],
      ledgerName: [
        this.ledgerDetails ? this.ledgerDetails.Name : "",
        Validators.required
      ],
      accountHead: [null],
      remarks: [this.ledgerDetails ? this.ledgerDetails.Remarks : ""],
      currency: [this.ledgerDetails ? this.ledgerDetails.Currency : ""],
      date: [this.ledgerDetails ? new Date() : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      previousYearBalanceList: this._fb.array([
        this.addPreviousYearBalanceFormGroup()
      ])
    });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      accountClass: [""],
      openingBalance: [""],
      balanceType: [""]
    });
  }

  addPreviousYearBalanceFormGroup(): FormGroup {
    return this._fb.group({
      accountClass: [""],
      openingBalance: [""],
      balanceType: [""]
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("openingBalanceList");
  }

  get getPreviousYearBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("previousYearBalanceList");
  }

  openModal(index: number): void {}

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.accoutLedgerForm.get("openingBalanceList").invalid) return;
    (<FormArray>this.accoutLedgerForm.get("openingBalanceList")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.accoutLedgerForm.get("openingBalanceList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.accoutLedgerForm.get("openingBalanceList")).removeAt(
      rowIndex
    );
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public saveAccountLedger(): void {
    if (this.accoutLedgerForm.valid) {
      this.router.navigate(["/ledger"]);
    } else {
    }
  }

  public cancelAccountLedger(): void {
    this.accoutLedgerForm.reset();
    this.router.navigate(["/ledger"]);
  }

  addProduct(): void {
    this.ledgerDetails = null;
    this.editMode = false;
    this.addMode = true;
    this.title = "Add Product ";
    this.buildAccountLedgerForm();
  }

  deleteProductGroup(): void {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "product";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteAccountLedgertByID(this.selectedLedgerId);
      }
    });
  }

  public deleteAccountLedgertByID(id): void {
    this.ledgerService.deleteLedgerById(id).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product deleted successfully");
      }
    );
  }
}
