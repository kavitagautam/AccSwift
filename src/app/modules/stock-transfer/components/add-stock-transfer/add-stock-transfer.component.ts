import { Router } from "@angular/router";
import { FormGroup, Validators, FormArray } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-add-stock-transfer",
  templateUrl: "./add-stock-transfer.component.html",
  styleUrls: ["./add-stock-transfer.component.scss"]
})
export class AddStockTransferComponent implements OnInit {
  private editedRowIndex: number;

  addStockTransferForm: FormGroup;

  submitted: boolean;
  rowSubmitted: boolean;
  constructor(private _fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.buildAddStockForm();
  }

  buildAddStockForm() {
    this.addStockTransferForm = this._fb.group({
      series: [null],
      voucherNo: ["", [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromDepotLoc: [null],
      toDepotLoc: [null],
      remarks: [""]
    });
  }

  public save(): void {
    if (this.addStockTransferForm.valid) {
      this.router.navigate(["/stock-transfer"]);
    }
  }

  public cancel(): void {
    this.addStockTransferForm.reset();
    this.router.navigate(["/stock-transfer"]);
  }

  // knedo uI
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.addStockTransferForm.invalid) return;
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
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
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.formGroup = undefined;
  }
}
