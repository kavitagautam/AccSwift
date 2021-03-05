import { LedgerService } from "@accSwift-modules/ledger/services/ledger.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-budget-details",
  templateUrl: "./budget-details.component.html",
  styleUrls: ["./budget-details.component.scss"],
})
export class BudgetDetailsComponent implements OnInit {
  @Input("budgetMasterDetails") public budgetMasterDetails: FormArray;
  public onClose = new Subject();
  public onSubmit: Subject<boolean>;
  rowSubmitted: boolean;
  submitted: boolean;
  private editedRowIndex: number;

  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    public ledgerService: LedgerService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    this.onSubmit = new Subject();
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const openingList = <FormArray>this.budgetMasterDetails;
    // Remove the Row
    openingList.removeAt(rowIndex);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.budgetMasterDetails.invalid) return;
    (<FormArray>this.budgetMasterDetails).push(
      this.budgetAllocationDetailsFormGroup()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  budgetAllocationDetailsFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      BudgetMasterID: [null],
      AccClassID: [null],
      AccClassName: "",
      Amount: [null],
    });
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}
