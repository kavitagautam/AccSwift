import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-ledger",
  templateUrl: "./list-ledger.component.html",
  styleUrls: ["./list-ledger.component.scss"]
})
export class ListLedgerComponent implements OnInit {
  @ViewChild("openingBalanceModal") openingBalanceModal: ElementRef;
  @ViewChild("previousYearBalanceModal") previousYearBalanceModal: ElementRef;
  private editedRowIndex: number;
  accountGroupForm: FormGroup;
  accoutLedgerForm: FormGroup;
  ledgerTreeList: any;
  treeViewLoading: boolean;
  rowSubmitted: boolean;
  submitted: boolean;

  //for Expanding the tree view
  public expandedKeys: any[] = ["0", "0_0"];
  constructor(
    public _fb: FormBuilder,
    private ledgerService: LedgerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.accountGroupForm = this._fb.group({
      groupCode: [""],
      groupName: [""],
      parentGroup: [""],
      description: [""]
    });

    this.accoutLedgerForm = this._fb.group({
      ledgerCode: [""],
      ledgerName: ["", Validators.required],
      accountHead: [""],
      remarks: [""],
      currency: ["", Validators.required],
      date: [""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      previousYearBalanceList: this._fb.array([
        this.addPreviousYearBalanceFormGroup()
      ])
    });
    this.treeViewLoading = true;
    this.ledgerService.getLedgerTree().subscribe(
      res => {
        this.ledgerTreeList = res;

        this.treeViewLoading = false;
      },
      error => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
    this.ledgerService.init();
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

  public saveAccountGroup(): void {
    if (this.accountGroupForm.valid) {
      this.router.navigate(["/ledger"]);
    } else {
    }
  }

  public cancelAccountGroup(): void {
    this.accountGroupForm.reset();
    this.router.navigate(["/ledger"]);
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
}
