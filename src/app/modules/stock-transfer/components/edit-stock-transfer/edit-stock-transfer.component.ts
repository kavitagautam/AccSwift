import { StockTransferService } from "./../../services/stock-transfer.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";

@Component({
  selector: "accSwift-edit-stock-transfer",
  templateUrl: "./edit-stock-transfer.component.html",
  styleUrls: ["./edit-stock-transfer.component.scss"]
})
export class EditStockTransferComponent implements OnInit {
  private editedRowIndex: number;

  editStockTransferForm: FormGroup;
  stockTransferDetails;

  submitted: boolean;
  rowSubmitted: boolean;
  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private stockTransferService: StockTransferService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildEditStockForm();
    this.getIdFromRoute();
  }

  buildEditStockForm() {
    this.editStockTransferForm = this._fb.group({
      series: [null],
      voucherNo: ["", [Validators.required]],
      date: [new Date(), [Validators.required]],
      fromDepotLoc: [null],
      toDepotLoc: [null],
      remarks: [""]
    });
  }

  getIdFromRoute() {
    // edit route component load
  }

  // knedo uI
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.editStockTransferForm.invalid) return;
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
  public save(): void {
    if (this.editStockTransferForm.valid) {
      this.router.navigate(["/stock-transfer"]);
    }
  }

  public cancel(): void {
    this.editStockTransferForm.reset();
    this.router.navigate(["/stock-transfer"]);
  }
}
